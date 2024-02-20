import { useContext, useState, useEffect, useRef } from "react"

import { DisplayContext, GameSettingsContext, AllCustomLayoutShapesContext, GameStatusContext, TimelineEntryContext } from "../../Game"
import { Canvas } from "@react-three/fiber";
import * as THREE from 'three'

import {Instances, Tile} from './Tile'
import Timer from './Timer';
import QuitModal from '../../components/QuitModal'
import RoundOverModal from "../../components/RoundOverModal";
import { OrbitControls, PerspectiveCamera, Environment, Sparkles } from "@react-three/drei";

const defaultSymbolFiles = import.meta.glob('/public/presets_library/symbol_presets/*.svg')
const defaultSymbolFileNames = Object.keys(defaultSymbolFiles)

const defaultSymbolColors = [
    'darkorchid',
    'magenta',
    'darkred',
    '#ff5b5b',
    'darkorange',
    'darkgoldenrod',
    '#13be00',
    'darkgreen',
    'darkcyan',
    'darkturquoise',
    'cornflowerblue',
    'darkblue',
    '#641d6d',
    'saddlebrown',
    'black',
    'dimgray',
]

export default function Gameboard() {

    const cameraRef = useRef(null)

    const {
        mode,
        setMode,
        rounds,
        setRounds,
        time,
        setTime,
        peekingLimit,
        setPeekingLimit,
        setTileDimensions,
        layoutShapes,
        setLayoutShapes,
        symbols,
        setSymbols,
        symbolColors,
        setSymbolColors,
        backgrounds,
        setBackgrounds,
    } = useContext(GameSettingsContext);

    const {
        setPresetLayouts, 
        setImportLayouts, 
        setDrawLayouts
    } = useContext(AllCustomLayoutShapesContext);

    const {timelineEntry, setTimelineEntry} = useContext(TimelineEntryContext);
    const {setGameStatus} = useContext(GameStatusContext);
    const {setDisplay} = useContext(DisplayContext);

    const [currentPeekingCount, setCurrentPeekingCount] = useState(0);
    const [peeking, setPeeking] = useState(true);
    const [isRoundOverModalVisible, setIsRoundOverModalVisible] = useState(false);
    const [isQuitModalVisible, setIsQuitModalVisible] = useState(false);
    const [currentTiles, setCurrentTiles] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [penalty, setPenalty] = useState(mode === 'a_race_against_time' ? 5 : 0);
    const [mistakeCount, setMistakeCount] = useState(0);
    
    // Due to the fact that during a game, none of the setState functions 
    // in the GameSettingsContext from the Game component will be run  
    // in the Gameboard component, it seems acceptable to set the initial  
    // states of the gameboard's settings as the most recent state of the 
    // GameSettingsContext settings.
    
    const [currentLayout, setCurrentLayout] = useState(
        createTileSpread(symbols, symbolColors, layoutShapes, 0)
    )
    const [currentBackground, setCurrentBackground] = useState(backgrounds[0]);
    
    const [startTime, setStartTime] = useState(Date.now())
    const [minutes, setMinutes] = useState(time.min);
    const [seconds, setSeconds] = useState(time.sec);

    // Creates array of objects, each one containing information about a tile
    function createTileSpread(symbols, symbolColors, layoutShapes, currentRound) {

        const tileSpreadArr = [];

        const tileCount = layoutShapes[currentRound].reduce((total, row) => total += row.reduce((total, tile) => total += tile, 0), 0);

        let symbolsArr = [...symbols];
        let symbolColorsArr = [...symbolColors];

        // First, if the number of possible symbol and color 
        // combos doesn't match tileCount, this if statement adds more
        // random colors and symbols.

        if (symbols.length * symbolColors.length < tileCount) {

            const finalSymbolsArrTotal = Math.ceil(Math.sqrt(tileCount));

            while (symbolsArr.length < finalSymbolsArrTotal) {

                const newRandomSymbolIndex = Math.floor(Math.random() * defaultSymbolFileNames.length);

                if (!symbolsArr.some(symbol => symbol === defaultSymbolFileNames[newRandomSymbolIndex])) {
                    symbolsArr.push(defaultSymbolFileNames[newRandomSymbolIndex]);
                }

            }

            const finalSymbolColorsArrTotal = Math.ceil(Math.sqrt(tileCount));

            while (symbolColorsArr.length < finalSymbolColorsArrTotal) {

                const newRandomSymbolColorIndex = Math.floor(Math.random() * defaultSymbolColors.length);

                if (!symbolColorsArr.some(symbolColor => symbolColor === defaultSymbolColors[newRandomSymbolColorIndex])) {
                    symbolColorsArr.push(defaultSymbolColors[newRandomSymbolColorIndex]);
                }

            }

        }

        // We then create a new symbol/color combo from these symbols and colors

        let combosArr = []

        // Used a while statement because otherwise there would have been a chance
        // that we skip adding a new combo if the combo already exists,
        // thus ending up with the length of combosArr being less than the tileCount

        while (combosArr.length < tileCount) {

            const randomSymbolIndex = Math.floor(Math.random() * symbolsArr.length);
            const randomSymbolColorIndex = Math.floor(Math.random() * symbolColorsArr.length);

            const newCombo = {
                symbol: symbolsArr[randomSymbolIndex],
                symbolColor: symbolColorsArr[randomSymbolColorIndex],
            }

            if (
                !combosArr.some(combo => {
                    return combo.symbol === newCombo.symbol && combo.symbolColor === newCombo.symbolColor;
                })
            ) 
            {
                // Only if the newCombo doesn't exist do we push and increment combosIndex.
                // We push the newCombo twice because every combo needs a matching tile.
                combosArr.push(newCombo);
                combosArr.push(newCombo);
            }

        }

        // After that, randomize the matches so that they 
        // are at different positions when displayed on the gameboard.

        let combosArrCopy = [...combosArr];
        let randomizedCombosArr = [];

        while (combosArrCopy.length > 0 && randomizedCombosArr.length < combosArr.length) {
            const newRandomComboIndex = Math.floor(Math.random() * combosArrCopy.length);

            randomizedCombosArr.push(combosArrCopy[newRandomComboIndex]);
            combosArrCopy.splice(newRandomComboIndex, 1);
        }

        // Finally, determine if a tile exists in the layout.
        // If so, add the symbol/color combo as well as the 
        // key, index, and position to the tile, and push it 
        // to the tileSpreadArr.

        let randomizedCombosIndex = 0;
        let yPosition = (layoutShapes[currentRound].length / 2 - .5) * -3;
        
        for (let rowIndex = 0; rowIndex < layoutShapes[currentRound].length; rowIndex++) {

            
            let row = layoutShapes[currentRound][rowIndex];

            let xPosition = (row.length / 2 - .5) * -2.35;

            for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {

                const tile = {};

                let position = new THREE.Vector3(xPosition, yPosition, 0);

                if (row[tileIndex] === 1) {

                    // xPosition and yPosition will still be incremented,
                    // despite empty tiles being skipped. 
                    // tileCount and the length of randomizedCombosArr
                    // will be equal, so no combos in randomizedCombosArr 
                    // will be missed when being pushed to tileSpreadArr.

                    tile['key'] = rowIndex + " " + tileIndex;
                    tile['id'] = rowIndex + " " + tileIndex;
                    tile['symbol'] = randomizedCombosArr[randomizedCombosIndex]['symbol'];
                    tile['symbolColor'] = randomizedCombosArr[randomizedCombosIndex]['symbolColor'];
                    tile['position'] = position;

                    tileSpreadArr.push(tile)
                    ++randomizedCombosIndex;

                }

                xPosition += 2.35;
                
            }

            yPosition += 3;

        }

        return tileSpreadArr;
    
    }

    function handleQuitModalClick(event) {

        if (event.target.id === 'quit-modal-yes-button') {

            setTimelineEntry(
                {
                    mode: '',
                    status: '',
                    time: [],
                    tileCount: [],
                    mistakeCount: []
                }
            );
            setMode('');
            setRounds(1);
            setTime(
                {
                    min: 1,
                    sec: 0
                }
            );
            setPeekingLimit(0);
            setTileDimensions(
                {
                    w: 2,
                    h: 2
                }
            );
            setLayoutShapes([]);
            setSymbols([]);
            setSymbolColors([]);
            setBackgrounds([]);
            setPresetLayouts([]) 
            setImportLayouts([]) 
            setDrawLayouts([])

            setDisplay('title_screen');

        } else if (event.target.id === 'quit-modal-no-button') {
            setIsQuitModalVisible(false);
        }
    }

    function handleRoundOverModalClick(event) {
        const newcurrentRound = currentRound + 1;

        let newLayoutIndex;
        if (layoutShapes[layoutShapes.length - 1] === 'default') {
            newLayoutIndex = 0;
        } else {
            newLayoutIndex = newcurrentRound;
        }
                    
        let newBackgroundIndex;
        if (backgrounds[backgrounds.length - 1] === 'default') {
            newBackgroundIndex = 0; 
        } else {
            newBackgroundIndex = newcurrentRound;
        }

        if (event.target.id === 'round-over-modal-continue-button') {
            if (mode === 'classic') {

                // add new time for this round to timeline entry state

                const newTime = ((time.min * 60) - (minutes * 60)) + (time.sec - seconds);

                const revisedTimelineEntryTimes = [...timelineEntry.time];
                revisedTimelineEntryTimes.push(newTime);

                // add new tile count for this round to timeline entry state

                const layoutShapesIndex = layoutShapes.length - 1 ? 0 : currentRound;

                const newTileCount = layoutShapes[layoutShapesIndex].reduce((total, row) => total += row.reduce((total, tile) => total += tile, 0), 0);

                const revisedTimelineEntryTileCount = [...timelineEntry.tileCount];
                revisedTimelineEntryTileCount.push(newTileCount);

                // add new peeking for this round to timeline entry state

                let newPeekingCount = currentPeekingCount;

                let revisedTimelineEntryPeekingCount = [];

                if (timelineEntry.peekingCount?.length > 0) {
                    revisedTimelineEntryPeekingCount = [...timelineEntry.peekingCount];
                    revisedTimelineEntryPeekingCount.push(newPeekingCount);
                } else {
                    revisedTimelineEntryPeekingCount = [newPeekingCount];
                }

                // add new mistake for this round to timeline entry state

                const newMistakeCount = mistakeCount;

                const revisedTimelineEntryMistakeCount = [...timelineEntry.mistakeCount];
                revisedTimelineEntryMistakeCount.push(newMistakeCount);

                // create updated timeline entry and set state

                const newTimelineEntry = {
                    mode: timelineEntry.mode,
                    status: timelineEntry.status,
                    time: [...revisedTimelineEntryTimes],
                    rounds: {current: timelineEntry.rounds?.current, total: timelineEntry.rounds?.total},
                    tileCount: [...revisedTimelineEntryTileCount],
                    peekingCount: [...revisedTimelineEntryPeekingCount],
                    mistakeCount: [...revisedTimelineEntryMistakeCount]
                }

                setTimelineEntry({...newTimelineEntry})

                setMinutes(time.min)
                setSeconds(time.sec)
                setCurrentPeekingCount(0);
                setMistakeCount(0);
                setCurrentLayout([...createTileSpread(symbols, symbolColors, layoutShapes, newLayoutIndex)])
                setCurrentBackground(backgrounds[newBackgroundIndex])

            } else if (mode === 'just_chilling') {

                // add new time for this round to timeline entry state

                let currentMinutes = Math.sign(minutes) === -1 ? -minutes : minutes;
                let currentSeconds = Math.sign(seconds) === -1 ? -seconds : seconds;

                const newTime = (currentMinutes * 60) + currentSeconds + ((Math.sign(currentMinutes) === -1 || Math.sign(currentMinutes) === -1) ? (time.min * 60) + time.sec : 0);

                const revisedTimelineEntryTimes = [...timelineEntry.time];
                revisedTimelineEntryTimes.push(newTime);

                // add new tile count for this round to timeline entry state

                const layoutShapesIndex = layoutShapes.length - 1 ? 0 : currentRound;

                const newTileCount = layoutShapes[layoutShapesIndex].reduce((total, row) => total += row.reduce((total, tile) => total += tile, 0), 0);

                const revisedTimelineEntryTileCount = [...timelineEntry.tileCount];
                revisedTimelineEntryTileCount.push(newTileCount);

                // add new peeking for this round to timeline entry state

                let newPeekingCount = currentPeekingCount;

                let revisedTimelineEntryPeekingCount = [];

                if (timelineEntry.peekingCount?.length > 0) {
                    revisedTimelineEntryPeekingCount = [...timelineEntry.peekingCount];
                    revisedTimelineEntryPeekingCount.push(newPeekingCount);
                } else {
                    revisedTimelineEntryPeekingCount = [newPeekingCount];
                }

                // add new mistake for this round to timeline entry state

                const newMistakeCount = mistakeCount;

                const revisedTimelineEntryMistakeCount = [...timelineEntry.mistakeCount];
                revisedTimelineEntryMistakeCount.push(newMistakeCount);

                // create updated timeline entry and set state

                const newTimelineEntry = {
                    mode: timelineEntry.mode,
                    status: timelineEntry.status,
                    time: [...revisedTimelineEntryTimes],
                    rounds: {current: timelineEntry.rounds?.current, total: timelineEntry.rounds?.total},
                    tileCount: [...revisedTimelineEntryTileCount],
                    peekingCount: [...revisedTimelineEntryPeekingCount],
                    mistakeCount: [...revisedTimelineEntryMistakeCount]
                }

                setTimelineEntry({...newTimelineEntry})

                // calc time

                setMinutes(time.min);
                setSeconds(time.sec);
                setCurrentPeekingCount(0);
                setMistakeCount(0);
                setCurrentLayout([...createTileSpread(symbols, symbolColors, layoutShapes, newLayoutIndex)]);
                setCurrentBackground(backgrounds[newBackgroundIndex]);

            } else if (mode === 'a_race_against_time') {

                // add new time for this round to timeline entry state

                let newTime = 0;

                if (timelineEntry.time.length === 0) {
                    newTime = ((time.min * 60) - (minutes * 60)) + (time.sec - seconds);
                } else {
                    const originalTime = (time.min * 60) + time.sec;
                    const currentTime = (minutes * 60) + seconds;
                    newTime = originalTime - currentTime - timelineEntry.time.reduce((total, time) => total += time, 0)
                }

                const revisedTimelineEntryTimes = [...timelineEntry.time];
                revisedTimelineEntryTimes.push(newTime);

                // add new tile count for this round to timeline entry state

                const layoutShapesIndex = layoutShapes.length - 1 ? 0 : currentRound;

                const newTileCount = layoutShapes[layoutShapesIndex].reduce((total, row) => total += row?.reduce((total, tile) => total += tile, 0), 0);

                const revisedTimelineEntryTileCount = [...timelineEntry.tileCount];
                revisedTimelineEntryTileCount.push(newTileCount);

                // add new peeking for this round to timeline entry state

                let previousTimelineEntryPeekingCount = [];

                if (timelineEntry.peekingCount?.length > 0) {
                    previousTimelineEntryPeekingCount = [...timelineEntry.peekingCount];
                } else {
                    previousTimelineEntryPeekingCount = [];
                }

                let newPeekingCount = currentPeekingCount - previousTimelineEntryPeekingCount?.reduce((total, peek) => total += peek, 0);

                let revisedTimelineEntryPeekingCount = [];

                if (timelineEntry.peekingCount?.length > 0) {
                    revisedTimelineEntryPeekingCount = [...timelineEntry.peekingCount];
                    revisedTimelineEntryPeekingCount.push(newPeekingCount);
                } else {
                    revisedTimelineEntryPeekingCount = [newPeekingCount];
                }

                // add new mistake for this round to timeline entry state

                const newMistakeCount = mistakeCount;

                const revisedTimelineEntryMistakeCount = [...timelineEntry.mistakeCount];
                revisedTimelineEntryMistakeCount.push(newMistakeCount);

                // create updated timeline entry and set state

                const newTimelineEntry = {
                    mode: timelineEntry.mode,
                    status: timelineEntry.status,
                    time: [...revisedTimelineEntryTimes],
                    rounds: {current: timelineEntry.rounds?.current, total: timelineEntry.rounds?.total},
                    tileCount: [...revisedTimelineEntryTileCount],
                    peekingCount: [...revisedTimelineEntryPeekingCount],
                    mistakeCount: [...revisedTimelineEntryMistakeCount]
                }

                setTimelineEntry({...newTimelineEntry})

                // setCurrentPeekingCount(0);
                setMistakeCount(0);
                setCurrentLayout([...createTileSpread(symbols, symbolColors, layoutShapes, newLayoutIndex)]);
                setCurrentBackground(backgrounds[newBackgroundIndex]);

            }

            setCurrentRound(newcurrentRound);
            setIsRoundOverModalVisible(false);
            setCurrentTiles([]);
            setPeeking(false);

        } else if (event.target.id === 'round-over-modal-quit-button') {

            setTimelineEntry(
                {
                    mode: '',
                    status: '',
                    time: [],
                    tileCount: [],
                    mistakeCount: []
                }
            );
            setMode('');
            setRounds(1);
            setTime(
                {
                    min: 1,
                    sec: 0
                }
            );
            setPeekingLimit(0);
            setTileDimensions(
                {
                    w: 2,
                    h: 2
                }
            );
            setLayoutShapes([]);
            setSymbols([]);
            setSymbolColors([]);
            setBackgrounds([]);
            setPresetLayouts([]) 
            setImportLayouts([]) 
            setDrawLayouts([])

            setDisplay('title_screen');

        }
    }

    function handlePeek() {

        cameraRef.current.position.x = 0;
        cameraRef.current.position.y = 0;
        cameraRef.current.position.z = cameraDistance;

        if (mode !== 'just_chilling') {
            if (peekingLimit - currentPeekingCount > 0) {
                if (peeking === false) {
                    let newCurrentPeekingCount = currentPeekingCount + 1;
                    setCurrentPeekingCount(newCurrentPeekingCount);
                    setPeeking(true);
                }
            }
        } else {
            if (peeking === false) {
                setPeeking(true)
                let newCurrentPeekingCount = currentPeekingCount + 1;
                setCurrentPeekingCount(newCurrentPeekingCount);
            }
        }
        
    }
    
    function subtractPenalty() {
        if (mode === 'a_race_against_time') {

            let newMinutes
            let newSeconds

            if (minutes === 0) {
                if (seconds > 0) {
                    newSeconds = seconds - penalty;
                    if (Math.sign(newSeconds) === -1) {
                        setSeconds(0);
                    } else {
                        setSeconds(newSeconds);
                    }
                }
            } else if (minutes > 0) {
                if (seconds > 0 && seconds >= penalty) {
                    newSeconds = seconds - penalty;
                    setSeconds(newSeconds);
                } else if (seconds < penalty) {
                    let remainder = seconds - penalty;
                    newSeconds = 60 - remainder;
                    newMinutes = minutes - 1;
                    setMinutes(newMinutes);
                    setSeconds(newSeconds);
                } else if (seconds === 0) {
                    newMinutes = minutes - 1;
                    newSeconds = 60 - penalty;
                    setMinutes(newMinutes);
                    setSeconds(newSeconds);
                }
            }

        }
    }

    function delayMatchDiscard(newCurrentTiles) {
        setTimeout(() => {
            if (
                newCurrentTiles[0]?.symbol === newCurrentTiles[1]?.symbol &&
                newCurrentTiles[0]?.symbolColor === newCurrentTiles[1]?.symbolColor
            ) {
                let firstId = newCurrentTiles[0].tileId;
                let secondId = newCurrentTiles[1].tileId;
    
                const newCurrentLayout = [...currentLayout].filter(tile => tile.id !== firstId && tile.id !== secondId)
                setCurrentLayout([...newCurrentLayout]);
                setCurrentTiles([]);
                
            } else {
                subtractPenalty();

                const newMistakeCount = mistakeCount + 1;
                setMistakeCount(newMistakeCount);

                setCurrentTiles([]);
                
            }
        }, 500)
    }
    
    function handleTileClick (tileId, symbol, symbolColor) {
        let newCurrentTiles = [...currentTiles];

        if (currentTiles?.some(tile => tile.tileId === tileId)) {
            newCurrentTiles = newCurrentTiles.filter(tile => tile.tileId !== tileId)
            setCurrentTiles([...newCurrentTiles]);
        } else if (currentTiles?.length === 0) {

            let newTile = {
                tileId: tileId,
                symbol: symbol,
                symbolColor: symbolColor
            };

            newCurrentTiles.push(newTile);
            setCurrentTiles([...newCurrentTiles]);
        } else if (currentTiles?.length === 1) {

            let newTile = {
                tileId: tileId,
                symbol: symbol,
                symbolColor: symbolColor
            };

            newCurrentTiles.push(newTile);
            setCurrentTiles([...newCurrentTiles]);
        }

        if (newCurrentTiles?.length === 2) {
            delayMatchDiscard(newCurrentTiles);
        }
        
    }    
    
    let cameraDistance = 15;

    let layoutShapesCurrentIndex = 
    layoutShapes[layoutShapes.length - 1] === 'default' ? 0 : currentRound;

    const initialTileCount = 
    layoutShapes[layoutShapesCurrentIndex]
    .reduce((total, row) => 
        total += row.reduce((total, tile) => total += tile, 0), 0
    );

    if (initialTileCount <= 16) {
        cameraDistance = 15;
    } else if (initialTileCount > 16 && initialTileCount < 36) {
        cameraDistance = 25;
    } else if (initialTileCount >= 36 && initialTileCount < 50) {
        cameraDistance = 35;
    } else {
        cameraDistance = 45;
    }

    let currentTileCount = 0;

    currentTileCount = currentLayout.length;

    let tileDisplay = [];

    if (currentLayout.length > 0) {
        tileDisplay = [...currentLayout].map(tile => {
            return (
                <Tile 
                    key={tile['key']} 
                    id={tile['id']} 
                    tileId={tile['id']} 
                    position={[tile['position'].x, tile['position'].y, tile['position'].z,]}
                    symbol={tile['symbol']}
                    symbolColor={tile['symbolColor']}
                    peeking={peeking}
                    currentTiles={currentTiles} 
                    handleTileClick={handleTileClick}
                />
            )
        })
    }

    let timerDisplay = (
        /* 
            If the mode is not equal to just_chilling, 
            and the tileCount and time equals 0, 
            hide timer, effectively pausing the timer.
        */
        (
            (mode === 'just_chilling' && currentLayout.length > 0) 
            || 
            currentLayout.length > 0 && (minutes > 0 || seconds > 0) 
            && 
            isQuitModalVisible === false
        )
        &&
        <Timer 
            mode={mode}
            startTime={startTime}
            setStartTime={setStartTime}
            minutes={minutes} 
            setMinutes={setMinutes}
            seconds={seconds} 
            setSeconds={setSeconds}
        />
    );

    let peekingButtonDisplay = (
        (
            (isQuitModalVisible === false && isRoundOverModalVisible === false)
            && 
            (
                (mode === 'just_chilling')
                ||
                (
                    mode !== 'just_chilling' 
                    && 
                    peekingLimit - currentPeekingCount > 0
                )
            )
        )
        ?
        <button onClick={handlePeek}>
            Peek at Tiles: 
            {
                mode !== 'just_chilling' 
                ? 
                peekingLimit - currentPeekingCount 
                : 
                <span>&infin;</span>
            }
        </button>
        :
        <></>
    );

    let quitButtonDisplay = (
        (
            (mode === 'just_chilling' && currentLayout.length > 0) 
            || 
            (mode !== 'just_chilling' && currentLayout.length > 0 
            && 
            (minutes > 0 || seconds > 0)) 
            && 
            isQuitModalVisible === false
        )
        &&
        <button 
            type="button" 
            onClick={() => setIsQuitModalVisible(true)} 
            id="quit-button"
        >
            Quit
        </button>
    );

    let canvasAndModalsDisplay = (
        isQuitModalVisible
        ?
        <QuitModal handleQuitModalClick={handleQuitModalClick} />
        :
        isRoundOverModalVisible
        ?
        <RoundOverModal handleRoundOverModalClick={handleRoundOverModalClick} />
        :
        <Canvas id="three-canvas">
            <Environment 
                files={currentBackground} 
                background={true} 
            />
            <PerspectiveCamera 
                ref={cameraRef} 
                makeDefault position={[0, 0, cameraDistance]} 
            />
            <OrbitControls 
                minAzimuthAngle={currentLayout.length > 0 ? -Math.PI / 2 : ''} 
                maxAzimuthAngle={currentLayout.length > 0 ? Math.PI / 2 : ''} 
            />
            <ambientLight intensity={2} color="#FFFED0" />
            <directionalLight position={[0, 0, 10]} intensity={2} color="#FFFED0" />
            <directionalLight position={[0, 0, -10]} intensity={2} color="#FFFED0" />
            <Sparkles count={60} scale={cameraDistance} size={6} speed={0.4} />
            <Instances>
                {
                    tileDisplay.length > 0 
                    ?
                    tileDisplay?.map((tile) => tile)
                    :
                    <></>
                }
            </Instances>
        </Canvas>
    );

    // To delay flipping all tiles back over after peeking
    useEffect(() => {
        if (peeking === true) {
            setTimeout(() => {
                setPeeking(false)
            }, currentLayout.length <= 16 ? 5000 : 10000)
        }

        return () => {}

    }, [peeking])

    // To end the game when time or tileCount runs out
    useEffect(() => {
        // FOR EACH ROUND
        
        let newCurrentRound = currentRound + 1;

        if (currentLayout.length === 0 && (minutes !== 0 || seconds !== 0)) {

            if (newCurrentRound === rounds) {

                // If you win the game

                const newGameStatus = 'win';

                let timelineEntryMode = '';

                if (mode === 'classic') {
                    timelineEntryMode = 'classic';
                } else if (mode === 'just_chilling') {
                    timelineEntryMode = 'just_chilling';
                } else if (mode === 'a_race_against_time') {
                    timelineEntryMode = 'a_race_against_time';
                }

                // add new time for this round to timeline entry state

                const newTime = ((time.min * 60) - (minutes * 60)) + (time.sec - seconds);

                const revisedTimelineEntryTimes = [...timelineEntry.time];
                revisedTimelineEntryTimes.push(newTime);

                // add new tile count for this round to timeline entry state

                const layoutShapesIndex = layoutShapes.length - 1 ? 0 : currentRound;

                const newTileCount = layoutShapes[layoutShapesIndex].reduce((total, row) => total += row.reduce((total, tile) => total += tile, 0), 0);

                const revisedTimelineEntryTileCount = [...timelineEntry.tileCount];
                revisedTimelineEntryTileCount.push(newTileCount);

                // add new peeking for this round to timeline entry state

                let newPeekingCount = currentPeekingCount;

                let revisedTimelineEntryPeekingCount = [];

                if (timelineEntry.peekingCount?.length > 0) {
                    revisedTimelineEntryPeekingCount = [...timelineEntry.peekingCount];
                    revisedTimelineEntryPeekingCount.push(newPeekingCount);
                } else {
                    revisedTimelineEntryPeekingCount = [newPeekingCount];
                }

                // add new mistake for this round to timeline entry state

                const newMistakeCount = mistakeCount;

                const revisedTimelineEntryMistakeCount = [...timelineEntry.mistakeCount];
                revisedTimelineEntryMistakeCount.push(newMistakeCount);

                // create updated timeline entry and set state

                const newTimelineEntry = {
                    mode: timelineEntryMode,
                    status: newGameStatus,
                    time: [...revisedTimelineEntryTimes],
                    rounds: {current: newCurrentRound, total: rounds},
                    tileCount: [...revisedTimelineEntryTileCount],
                    peekingCount: [...revisedTimelineEntryPeekingCount],
                    mistakeCount: [...revisedTimelineEntryMistakeCount]
                }

                setCurrentTiles([]);
                setTimelineEntry({...newTimelineEntry})
                setGameStatus(newGameStatus)
                setDisplay('game_over_winner')
                // fireworks/sparkles
            } else if (newCurrentRound < rounds) {
                // Star animations with satisfying sound coming out of modal? If clicked, then:
                setIsRoundOverModalVisible(true)
            }

        } else if (mode !== 'just_chilling' && currentLayout.length > 0 && (minutes === 0 && seconds === 0)) {

            // If you lose the game

            const newGameStatus = 'lose';
            
            let timelineEntryMode = '';

            if (mode === 'classic') {
                timelineEntryMode = 'classic';
            } else if (mode === 'just_chilling') {
                timelineEntryMode = 'just_chilling';
            } else if (mode === 'a_race_against_time') {
                timelineEntryMode = 'a_race_against_time';
            }

            // add new time for this round to timeline entry state
            
            let newTime = 0;

            if (mode === 'classic') {

                newTime = (time.min * 60) + time.sec;

            } else if (mode === 'a_race_against_time') {

                if (timelineEntry.time.length === 0) {
                    newTime = ((time.min * 60) - (minutes * 60)) + (time.sec - seconds);
                } else {
                    const originalTime = (time.min * 60) + time.sec;
                    newTime = originalTime - timelineEntry.time.reduce((total, time) => total += time, 0)
                }

            }

            const revisedTimelineEntryTimes = [...timelineEntry.time];
            revisedTimelineEntryTimes.push(newTime);

            // add new tile count for this round to timeline entry state

            const layoutShapesIndex = layoutShapes.length - 1 ? 0 : currentRound;

            const newTileCount = layoutShapes[layoutShapesIndex].reduce((total, row) => total += row.reduce((total, tile) => total += tile, 0), 0);

            const revisedTimelineEntryTileCount = [...timelineEntry.tileCount];
            revisedTimelineEntryTileCount.push(newTileCount);

            // add new peeking for this round to timeline entry state

            let newPeekingCount = currentPeekingCount;

            let revisedTimelineEntryPeekingCount = [];

            if (timelineEntry.peekingCount?.length > 0) {
                revisedTimelineEntryPeekingCount = [...timelineEntry.peekingCount];
                revisedTimelineEntryPeekingCount.push(newPeekingCount);
            } else {
                revisedTimelineEntryPeekingCount = [newPeekingCount];
            }

            // add new mistake for this round to timeline entry state

            const newMistakeCount = mistakeCount;

            const revisedTimelineEntryMistakeCount = [...timelineEntry.mistakeCount];
            revisedTimelineEntryMistakeCount.push(newMistakeCount);

            // create updated timeline entry and set state

            const newTimelineEntry = {
                mode: timelineEntryMode,
                status: newGameStatus,
                time: [...revisedTimelineEntryTimes],
                rounds: {current: newCurrentRound, total: rounds},
                tileCount: [...revisedTimelineEntryTileCount],
                peekingCount: [...revisedTimelineEntryPeekingCount],
                mistakeCount: [...revisedTimelineEntryMistakeCount]
            }

            setCurrentTiles([]);
            setTimelineEntry({...newTimelineEntry})
            setGameStatus(newGameStatus);
            setDisplay('game_over')

        }

        return () => {};

    }, [currentTileCount, minutes, seconds])

    return (
        <div id="gameboard-container">
            <div id="gameboard-display">
                <h2 id="round-header">Round {currentRound + 1}/{rounds}</h2>
                
                <div id="timer-peek-button-container">
                    {peekingButtonDisplay} 
                    {timerDisplay}
                </div>

                {canvasAndModalsDisplay}
            </div>

            {quitButtonDisplay}
        </div>
    )
}