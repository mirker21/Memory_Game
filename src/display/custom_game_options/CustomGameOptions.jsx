import { useContext, useRef, useEffect } from "react";

import { 
    GameSettingsContext, 
    DisplayContext, 
    AllCustomLayoutShapesContext 
} from "../../Game";

import ClassicCustomGameOptions from './ClassicCustomGameOptions';
import JustChillingCustomGameOptions from './JustChillingCustomGameOptions';
import ARaceAgainstTimeCustomGameOptions from './ARaceAgainstTimeCustomGameOptions';

const imagePresetFiles = import.meta.glob(
    '/public/presets_library/background_presets/*.hdr'
);
const imagePresetFileNames = Object.keys(imagePresetFiles);

export default function CustomGameOptions() {
    const canvasRef = useRef('canvas#layout-canvas');

    const {setDisplay} = useContext(DisplayContext);

    const 
    {
        mode,
        rounds,
        setRounds,
        setTime,
        setPeekingLimit,
        tileDimensions,
        setTileDimensions,
        layoutShapes,
        setLayoutShapes,
        setSymbols,
        backgrounds,
        setBackgrounds,
        setSymbolColors,

    } = useContext(GameSettingsContext);

    const {
        presetLayouts, 
        importLayouts, 
        drawLayouts, 
    } = useContext(AllCustomLayoutShapesContext);

    let customGameOptionDisplay;
    // certain displays exclude some 
    // settings because they are irrelevant
    // to the game mode selected

    if (mode === 'classic') {
        customGameOptionDisplay = 
        <ClassicCustomGameOptions />;
    } else if (mode === 'just_chilling') {
        customGameOptionDisplay = 
        <JustChillingCustomGameOptions />;
    } else if (mode === 'a_race_against_time') {
        customGameOptionDisplay = 
        <ARaceAgainstTimeCustomGameOptions />;
    }

    // Convert selected presets to nested arrays.
    const convertPresets = async function (ref, presetLayouts) {
        let convertedLayouts = [];
    
        if (presetLayouts.length > 0) {
    
            for (let presetIndex = 0; presetIndex < presetLayouts.length; presetIndex++) {
    
                let newConvertedPreset = await new Promise((resolve, reject) => {
    
                    const preset = [];
    
                    let img = new Image();
                    img.crossOrigin='Anonymous';
                    
                    let ctx = ref.current.getContext('2d', { alpha: true, desynchronized: false, colorSpace: 'srgb', willReadFrequently: true})
                    ctx.translate(16, 16)
                    ctx.rotate(Math.PI)
                    ctx.globalCompositeOperation = "copy";
    
                    let imageData;
    
                    img.onload = async function () {
    
                        ctx.width = img.width;
                        ctx.height = img.height;
                        ctx.imageSmoothingEnabled = false;
                        
                        ctx.drawImage(img, 0, 0);
                        imageData = ctx.getImageData(0, 0, 16, 16, {colorSpace: 'srgb'}).data;
                        for (let rowIndex = 0; rowIndex < 16; rowIndex++) {
    
                            let newRow = [];
                            
                            for (let i = 0 + 64 * rowIndex; i < 64 + 64 * rowIndex; i += 4) {
                                // every 4th imageData element is 
                                // the alpha channel for each pixel
    
                                if (imageData[i + 3] === 255) {
                                    newRow.push(1);
                                } else if (imageData[i + 3] === 0) {
                                    newRow.push(0);
                                }
    
                            }
    
                            preset.push(newRow)
    
                        }
    
                        resolve(preset)
    
                    }
    
                    img.src = presetLayouts[presetIndex];
    
                }).then(data => data)
    
                convertedLayouts.push(newConvertedPreset);
    
            }
    
        }
    
        return convertedLayouts;
    
    }

    const handleClick = async function (event) {
        if (event.target.className === 'back-button') {

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

            setDisplay('game_presets_options');

        } else if (event.target.className === 'start-game-button') {

            // It would be more efficient if the selected preset layouts were converted 
            // all at once when the user is done editing the settings to their game,

            const convertedPresetLayouts = await convertPresets(canvasRef, presetLayouts)
            .then((data) => data);

            // converting presetLayouts moved to presets
            // so users can see which layouts did not pass the requirements.
            const revisedImportLayouts = importLayouts.map(file => file['fileSrc']);
            const revisedDrawLayouts = drawLayouts.map(file => file['layout']);

            const layouts = [
                ...convertedPresetLayouts, 
                ...revisedImportLayouts, 
                ...revisedDrawLayouts
            ];

            if (layouts.length === 0) {

                let defaultLayoutShape = []

                for (let rowIndex = 0; rowIndex < tileDimensions.h; rowIndex++) {

                    const newRow = new Array(tileDimensions.w).fill(1);

                    if ((tileDimensions.h * tileDimensions.w) % 2 !== 0) {
                        if (rowIndex === Math.floor(tileDimensions.h / 2)) {
                            newRow[Math.floor(tileDimensions.w / 2)] = 0;
                        }
                    } 
                    defaultLayoutShape.push(newRow);

                }

                setLayoutShapes([defaultLayoutShape, 'default']);

            } else {
                setLayoutShapes([...layouts]);
            }

            if (backgrounds.length === 0) {

                let newBackgrounds = []

                for (let backgroundIndex = 0; backgroundIndex < rounds; backgroundIndex++) {
                    const newRandomBackgroundIndex = Math.floor(Math.random() * rounds);
                    newBackgrounds.push(imagePresetFileNames[newRandomBackgroundIndex]);
                }

                setBackgrounds([...newBackgrounds])

            }
            
        }
    }

    useEffect(() => {

        if (layoutShapes.length > 0) {
            setDisplay('gameboard');
        }

    }, [layoutShapes])

    return (
        <section id="custom-game-options-page">
            <canvas 
                id="layout-canvas" 
                ref={canvasRef} 
                width="16" 
                height="16"
            >
            </canvas>

            <div className="title-back-button-container">
                <button 
                    className="back-button" 
                    onClick={handleClick}
                >
                    &larr;
                </button>

                <h2>
                    <span>{mode.replace(/_/g, ' ')}</span>
                    <hr />
                    <span>Custom Game Options</span>
                </h2>
            </div>
            
            {customGameOptionDisplay}

            <button 
                className="start-game-button" 
                onClick={handleClick}
            >
                Start Game!
            </button>
        </section>
    )
}