import { useContext } from "react";

import { GameSettingsContext } from "../../Game";

const imagePresetFiles = import.meta.glob(
    './presets_library/layout_presets/*.png'
);
let imagePresetFileNames = Object.keys(imagePresetFiles)

import Checkmark from "../../components/Checkmark";

export default function Preset({presetLayouts, setPresetLayouts, layoutCount}) {
    
    const {rounds} = useContext(GameSettingsContext);
    
    function handleChange(event) {

        if (presetLayouts.includes(event.target.value)) {
            const newPresetLayouts = presetLayouts.filter(layout => {
                return layout !== event.target.value;
            })
            setPresetLayouts([...newPresetLayouts]);
        } else if (layoutCount < rounds) {
            setPresetLayouts([...presetLayouts, event.target.value]);
        }
    }

    function handleClear() {
        setPresetLayouts([])
    }

    return (
        <div className="custom-settings-inner-window-display">
            <section>
                <h3>Note:</h3>

                <p>Multiple layouts Chosen will be rotated each round</p>
            
                {
                    layoutCount === rounds 
                    && 
                    <p className="warn">
                        The number of layouts you chose equals the number 
                        of rounds you set. If you would like to add more 
                        layouts, increase the number of rounds.
                    </p>
                }
                
                <button onClick={handleClear}>Clear Preset Choices</button>
            </section>
            
            <section className="custom-files-container">
                {
                    imagePresetFileNames?.map((fileName, index) => {
                        return (
                            <div 
                                key={fileName + index} 
                                className="custom-single-file-container" 
                                title={
                                    fileName
                                    .replace('./presets_library/layout_presets/', '')
                                    .replace('.png', '')
                                    .replace(/_/g, ' ')
                                }
                            >
                                <button 
                                    type="button" 
                                    className="custom-import-draw-checkbox-button" 
                                    id={fileName} 
                                    onClick={handleChange}
                                    value={fileName}
                                >
                                    {presetLayouts?.includes(fileName) && <Checkmark />}
                                </button>

                                <label 
                                    className="custom-single-file-container-label" 
                                    htmlFor={fileName}
                                >
                                    {
                                        fileName
                                        .replace('./presets_library/layout_presets/', '')
                                        .replace('.png', '')
                                        .replace(/_/g, ' ')
                                    }
                                </label>
                            </div>
                        )
                    })
                }
            </section>
        </div>
    )
}
