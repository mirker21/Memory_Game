import { useState, useContext } from 'react';

import { DisplayContext, GameSettingsContext } from '../../Game';

const imagePresetFiles = import.meta.glob('/presets_library/symbol_presets/*.svg')
const imagePresetFileNames = Object.keys(imagePresetFiles)
// In case if no symbols are selected, imagePresetFileNames will be the default.

import Preset from './Preset'

export default function CustomTileSymbols() {
    const {setSymbols, setSymbolColors} = useContext(GameSettingsContext);
    const {setDisplay} = useContext(DisplayContext);

    const [source, setSource] = useState('preset');
    const [presetSymbols, setPresetSymbols] = useState([]);
    const [addedSymbolColors, setAddedSymbolColors] = useState([]);

    // changes display depending on where you get the symbols
    function handleClick(event) {

        if (event.target.id === 'custom-tile-symbols-source-preset') {
            setSource('preset');
        } else if (event.target.className === 'back-button') {
            setDisplay('custom_game_options');
        }

    }

    // sets game settings for symbols and symbol colors
    function handleSubmit(event) {
        event.preventDefault();

        const combinedSymbols = [...presetSymbols];

        setSymbols([...combinedSymbols]);

        setSymbolColors([...addedSymbolColors]);

        setDisplay('custom_game_options')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="title-back-button-container">
                <button 
                    type="button" 
                    className="back-button" 
                    onClick={handleClick}
                >
                    &larr; Cancel
                </button>
                
                <h2 id="custom-symbols-header">Custom Symbols</h2>
            </div>
            
            <div className="custom-setting-menu-button-container">
                <button type="button" 
                    id="custom-tile-symbols-source-preset" 
                    className={
                        source === 'preset' 
                        ? 
                        'highlighted-option-button' 
                        : 
                        'custom-setting-menu-button'
                    }
                    onClick={handleClick}
                >
                    Choose Preset Symbols
                </button>
            </div>

            <Preset 
                presetSymbols={presetSymbols} 
                setPresetSymbols={setPresetSymbols}
                imagePresetFileNames={imagePresetFileNames}
            />
            
            <button type="submit">Confirm Choices</button>
        </form>
    )
}
