import { useState, useRef, useContext } from 'react';

import { AllCustomLayoutShapesContext, DisplayContext } from '../../Game';

import Preset from './Preset'
import Import from './Import'
import Draw from './Draw'

export default function CustomTileLayout() {

    const {setDisplay} = useContext(DisplayContext);
    const canvasRef = useRef(null);

    const [source, setSource] = useState('preset');

    const {
        presetLayouts,  
        setPresetLayouts, 
        importLayouts, 
        setImportLayouts, 
        drawLayouts, 
        setDrawLayouts
    } = useContext(AllCustomLayoutShapesContext);

    const layoutCount = 
        presetLayouts.length 
        + importLayouts.length
        + drawLayouts.length;

    // To be able to clear all choices in 
    // one tab but not the other, I needed to set 
    // a layouts state for each of the three tabs: 
    // the preset, the import and the draw.

    // On submit, all three layout states will
    // be checked for emptiness. If so, revert
    // to the default.
    // If not, the gameSettings will get updated.

    function handleClick(event) {

        if (event.target.id === 'custom-tile-layout-source-preset') {
            setSource('preset');
        } else if (event.target.id === 'custom-tile-layout-source-import') {
            setSource('import');
        } else if (event.target.id === 'custom-tile-layout-source-draw') {
            setSource('draw');
        } else if (event.target.className === 'back-button') {
            setDisplay('custom_game_options');
        }

    }

    function handleSubmit(event) {
        event.preventDefault();

        setDisplay('custom_game_options')
    }

    let customTileLayoutDisplay;

    if (source === 'preset') {
        customTileLayoutDisplay = 
        (<Preset 
            presetLayouts={presetLayouts} 
            setPresetLayouts={setPresetLayouts}
            layoutCount={layoutCount}
        />);
    } else if (source === 'import') {
        customTileLayoutDisplay = 
        (<Import 
            importLayouts={importLayouts} 
            setImportLayouts={setImportLayouts}
            layoutCount={layoutCount}
        />);
    } else if (source === 'draw') {
        customTileLayoutDisplay = 
        (<Draw 
            drawLayouts={drawLayouts} 
            setDrawLayouts={setDrawLayouts}
            layoutCount={layoutCount}
        />);
    }

    return (
        <form onSubmit={handleSubmit}>
            <canvas 
                id="layout-canvas" 
                ref={canvasRef} 
                width="16" 
                height="16"
            >
            </canvas>

            <div className="title-back-button-container">
                <button 
                    type="button" 
                    className="back-button" 
                    onClick={handleClick}
                >
                    &larr; Cancel
                </button>
                
                <h2>Custom Layouts</h2>
            </div>

            <div className="custom-setting-menu-button-container">
                <button 
                    type="button"
                    id="custom-tile-layout-source-preset" 
                    className={
                        source === 'preset' 
                        ? 'highlighted-option-button' 
                        : 'game-mode-option-button'
                    }
                    onClick={handleClick}
                >
                    Preset Layouts
                </button>

                <button
                    type="button" 
                    id="custom-tile-layout-source-import" 
                    className={
                        source === 'import' 
                        ? 'highlighted-option-button' 
                        : 'game-mode-option-button'
                    }
                    onClick={handleClick}
                >
                    Import Layouts
                </button>
                
                <button
                    type="button" 
                    id="custom-tile-layout-source-draw" 
                    className={
                        source === 'draw' 
                        ? 'highlighted-option-button' 
                        : 'game-mode-option-button'
                    }
                    onClick={handleClick}
                >
                    Draw Layouts
                </button>
            </div>            

            {customTileLayoutDisplay}
            
            <button type="submit">Confirm Choices</button>
        </form>
    )
}