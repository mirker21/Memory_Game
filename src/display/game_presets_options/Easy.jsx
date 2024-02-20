import { useContext } from "react"

import { GameSettingsContext } from "../../Game";
import { DisplayContext } from "../../Game"

const imagePresetFiles = import.meta.glob('/public/presets_library/background_presets/*.hdr');
const imagePresetFileNames = Object.keys(imagePresetFiles);

export default function Easy() {
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

    // Depending on the mode chosen,
    // game settings will be set 
    // with certain values
    function handleClick() {

        const newRounds = 3;

        if (mode === 'classic') {

            const newTileDimensions = {
                w: 4,
                h: 4
            }

            setRounds(newRounds);
            setTime(
                {
                    min: 5,
                    sec: 0
                }
            );
            setPeekingLimit(5);
            setTileDimensions(newTileDimensions);
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
                w: 4,
                h: 4
            }

            setRounds(newRounds);
            setTime(
                {
                    min: 10,
                    sec: 0
                }
            );
            setPeekingLimit(0);
            setTileDimensions(newTileDimensions);
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
                w: 4,
                h: 4
            }

            setRounds(newRounds);
            setTime(
                {
                    min: 10,
                    sec: 0
                }
            );
            setPeekingLimit(5);
            setTileDimensions(newTileDimensions);
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
                <p>Difficulty: Easy</p>
                <p>Tile Dimensions: W:4, H:4</p>
                <p>Tile Count: 16 Tiles</p>
                <p>Rounds: 3</p>
                <p>Time: 5 min per game</p>
               
                {
                    mode === 'classic' || mode === 'a_race_against_time' 
                    && 
                    <p>
                        Peeking Limit: 5 times per 
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

            <hr />

            <button onClick={handleClick}>Start Game!</button>          
        </section>
    )
}