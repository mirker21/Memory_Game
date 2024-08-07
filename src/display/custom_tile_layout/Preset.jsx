import { useContext } from "react";

import { GameSettingsContext } from "../../Game";

import * as images from '../../../dist/presets_library/layout_presets'

const imagePresetFiles = import.meta.glob(
    './vercel/path0/static/presets_library/layout_presets/*.png'
);
let imagePresetFileNames = Object.keys(imagePresetFiles)

import * as fs from 'fs'
export function GET_PRESETS(subdirectory) {
  let presetsPath = process.cwd() + '/presets_library/' + subdirectory;
  let files = fs.readdirSync(presetsPath);
  return new Response(files);
}

import Checkmark from "../../components/Checkmark";

export default function Preset({presetLayouts, setPresetLayouts, layoutCount}) {
    console.log(GET_PRESETS)
    console.log(images)
    console.log(imagePresetFileNames)
    
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
                                    .replace('../../../dist/presets_library/layout_presets/', '')
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
                                        .replace('../../../dist/presets_library/layout_presets/', '')
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
