import { useContext } from "react"

import Game, { GameSettingsContext } from "../../Game";
import { DisplayContext } from "../../Game"

const imagePresetFiles = import.meta.glob('./presets_library/background_presets/*.hdr');
const imagePresetFileNames = Object.keys(imagePresetFiles);

export default function Hard() {
    const {setDisplay} = useContext(DisplayContext);

    const 
    {
        mode,
        setRounds,
        setTime,
        setPeekingLimit,
        setTileDimensions,
        setLayoutShapes,
        setSymbols,
        setSymbolColors,
        setBackgrounds

    } = useContext(GameSettingsContext);

    function handleClick() {

        const newRounds = 10;
        
        if (mode === 'classic') {

            const newTileDimensions = {
                w: 8,
                h: 8
            }
            
            setRounds(newRounds);
            setTime(
                {
                    min: 3,
                    sec: 0
                }
            );
            setPeekingLimit(1);
            setTileDimensions(newTileDimensions);
            setLayoutShapes([]);
            setSymbols([]);
            setSymbolColors([]);
            setBackgrounds([]);

            let defaultLayoutShape = []
                
            for (let rowIndex = 0; rowIndex < newTileDimensions.h; rowIndex++) {

                const newRow = new Array(newTileDimensions.w).fill(1);

                if ((newTileDimensions.h * newTileDimensions.w) % 2 !== 0) {
                    if (rowIndex === Math.floor(newTileDimensions.h / 2)) {
                        newRow[Math.floor(newTileDimensions.w / 2)] = 0;
                    }
                } 
                defaultLayoutShape.push(newRow);

            }

            setLayoutShapes([defaultLayoutShape, 'default']);
            
            setDisplay('gameboard');
            
        } else if (mode === 'just_chilling') {

            const newTileDimensions = {
                w: 8,
                h: 8
            }
            
            setRounds(newRounds);
            setTime(
                {
                    min: 3,
                    sec: 0
                }
            );
            setPeekingLimit('infinite');
            setTileDimensions(newTileDimensions);
            setLayoutShapes([]);
            setSymbols([]);
            setSymbolColors([]);
            setBackgrounds([]);

            let defaultLayoutShape = []
                
            for (let rowIndex = 0; rowIndex < newTileDimensions.h; rowIndex++) {

                const newRow = new Array(newTileDimensions.w).fill(1);

                if ((newTileDimensions.h * newTileDimensions.w) % 2 !== 0) {
                    if (rowIndex === Math.floor(newTileDimensions.h / 2)) {
                        newRow[Math.floor(newTileDimensions.w / 2)] = 0;
                    }
                } 
                defaultLayoutShape.push(newRow);

            }

            setLayoutShapes([defaultLayoutShape, 'default']);
            
            setDisplay('gameboard');
            
        } else if (mode === 'a_race_against_time') {

            const newTileDimensions = {
                w: 8,
                h: 8
            }
            
            setRounds(newRounds);
            setTime(
                {
                    min: 6,
                    sec: 0
                }
            );
            setPeekingLimit(1);
            setTileDimensions(newTileDimensions);
            setLayoutShapes([]);
            setSymbols([]);
            setSymbolColors([]);
            setBackgrounds([]);

            let defaultLayoutShape = []
                
            for (let rowIndex = 0; rowIndex < newTileDimensions.h; rowIndex++) {

                const newRow = new Array(newTileDimensions.w).fill(1);

                if ((newTileDimensions.h * newTileDimensions.w) % 2 !== 0) {
                    if (rowIndex === Math.floor(newTileDimensions.h / 2)) {
                        newRow[Math.floor(newTileDimensions.w / 2)] = 0;
                    }
                } 
                defaultLayoutShape.push(newRow);

            }

            setLayoutShapes([defaultLayoutShape, 'default']);
            
            setDisplay('gameboard');
            
        }

        let newBackgrounds = []

        for (let backgroundIndex = 0; backgroundIndex < newRounds; backgroundIndex++) {
            const newRandomBackgroundIndex = Math.floor(Math.random() * newRounds);
            newBackgrounds.push(imagePresetFileNames[newRandomBackgroundIndex]);
        }

        setBackgrounds([...newBackgrounds])

    }

    return (
        <section className="game-preset-option-info-container">
            <div>
                <p>Difficulty: Hard</p>
                <p>Tile Dimensions: W:8, H:8</p>
                <p>Tile Count: 64 Tiles</p>
                <p>Rounds: 10</p>
                <p>Time: 3 min per game</p>
                {
                    mode === 'classic' || mode === 'a_race_against_time' 
                    && 
                    <p>
                        Peeking Limit: Once per 
                        {
                            mode === 'a_race_against_time' 
                            ? 
                            "game" 
                            : 
                            "round"
                        }
                    </p>
                }
            </div>  
            <button onClick={handleClick}>Start Game!</button>          
        </section>
    )
}
