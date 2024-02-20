import { useContext } from "react";
import { GameSettingsContext } from "../../Game";

const imagePresetFiles = import.meta.glob('/public/presets_library/background_presets/*.hdr');
const imagePresetFileNames = Object.keys(imagePresetFiles);

import Checkmark from "../../components/Checkmark";

export default function Preset({presetBackgrounds, setPresetBackgrounds, backgroundCount}) {
    const {rounds} = useContext(GameSettingsContext);

    function handlePresetBackgroundsChange(event) {
        if (event.target.className === 'custom-import-draw-checkbox-button') {

            if (presetBackgrounds.includes(event.target.value)) {
                let newPresetBackgrounds = 
                presetBackgrounds
                .filter(fileName => fileName !== event.target.value);
                setPresetBackgrounds([...newPresetBackgrounds])
            } else if (backgroundCount < rounds) {
                setPresetBackgrounds([...presetBackgrounds, event.target.value]);
            }

        } 
    }

    function handleClear() {
        setPresetBackgrounds([]);
    }

    return (
        <div className="custom-settings-inner-window-display">
            <section>
                <h2>NOTE:</h2>

                <div>
                    <p>File must be in the .hdr format</p>
                    <p>Multiple images added will be rotated each round</p> 
                </div>
                
                <button 
                    type="button" 
                    onClick={handleClear}
                >
                        Clear Preset Choices
                </button>

                {
                    backgroundCount === rounds 
                    && 
                    <p>
                        The number of layouts you chose equals the number 
                        of rounds you set. If you would like to add more 
                        layouts, increase the number of rounds.
                    </p>
                }
            </section>

            <section className="custom-files-container" id="symbol-files-container">
                {imagePresetFileNames?.map((fileName, index) => {
                    return (
                        <div 
                            key={fileName + index} 
                            className="custom-single-file-container" 
                            title={
                                fileName
                                .replace('/public/presets_library/background_presets/', '')
                                .replace('4k.hdr', '')
                                .replace(/_/g, ' ')
                            }
                        >
                            <button 
                                    type="button" 
                                    className="custom-import-draw-checkbox-button" 
                                    id={fileName} 
                                    onClick={handlePresetBackgroundsChange}
                                    value={fileName}
                            >
                                {presetBackgrounds.includes(fileName) && <Checkmark />}
                            </button>

                            <label 
                                className="custom-single-file-container-label" 
                                htmlFor={fileName}
                            >
                                {
                                    fileName
                                    .replace('/public/presets_library/background_presets/', '')
                                    .replace('4k.hdr', '')
                                    .replace(/_/g, ' ')
                                }
                            </label>
                        </div>
                    )
                })}
            </section>
        </div>
    )
}