import { useState, useContext } from 'react';

import { DisplayContext, GameSettingsContext } from "../../Game"

import Preset from './Preset'
import Import from './Import'

export default function CustomBackground() {
    const {setBackgrounds} = useContext(GameSettingsContext);
    const {setDisplay} = useContext(DisplayContext);
    const [source, setSource] = useState('preset')
    const [presetBackgrounds, setPresetBackgrounds] = useState([])
    const [importBackgrounds, setImportBackgrounds] = useState([])

    const backgroundCount = 
    presetBackgrounds.length 
    + 
    importBackgrounds.length;

    // combine all presetBackgrounds and importBackgrounds
    function handleSubmit(event) {
        event.preventDefault();

        const revisedImportBackgrounds = importBackgrounds.map(file => file['fileSrc'])

        const allBackgrounds = [...presetBackgrounds, ...revisedImportBackgrounds];
        console.log(allBackgrounds)

        setBackgrounds([...allBackgrounds]);

        setDisplay('custom_game_options');
    }

    // changes display of where the user gets the backgrounds.
    function handleClick(event) {
        // The source of the background images changes 
        // every time the deselected button is clicked.
        if (event.target.id === 'custom-background-source-preset') {
            setSource('preset');
        } else if (event.target.id === 'custom-background-source-import') {
            setSource('import');
        } else if (event.target.className === 'back-button') {
            setDisplay('custom_game_options');
        }
    }

    let customBackgroundDisplay;

    if (source === 'preset') {
        customBackgroundDisplay =
        (<Preset 
            presetBackgrounds={presetBackgrounds} 
            setPresetBackgrounds={setPresetBackgrounds}
            backgroundCount={backgroundCount}
        />)
    } else if (source === 'import') {
        customBackgroundDisplay =
        (<Import 
            importBackgrounds={importBackgrounds} 
            setImportBackgrounds={setImportBackgrounds}
            backgroundCount={backgroundCount}
        />)
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

                <h2>Custom Backgrounds</h2>
            </div>
            
            <div className="custom-setting-menu-button-container">
                <button 
                    type="button" 
                    id="custom-background-source-preset"
                    className={source === 'preset' ? 'highlighted-option-button' : ''}
                    onClick={handleClick}
                >
                    Choose Preset Backgrounds
                </button>

                <button 
                    type="button" 
                    id="custom-background-source-import"
                    className={source === 'import' ? 'highlighted-option-button' : ''}
                    onClick={handleClick}
                >
                    Import Background Images
                </button>
            </div>

            {customBackgroundDisplay}

            <button type="submit">Confirm Choices</button>
        </form>
    )
}