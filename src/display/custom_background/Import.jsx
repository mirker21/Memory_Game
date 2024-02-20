import { v4 as uuid } from 'uuid';

import { useContext } from "react";
import { GameSettingsContext } from "../../Game";

import Checkmark from "../../components/Checkmark";

export default function Import({importBackgrounds, setImportBackgrounds, backgroundCount}) {
    const {rounds} = useContext(GameSettingsContext);

    // Many thanks to James_Hibbard from https://www.sitepoint.com/community/t/filereader-api-getting-image-width/29254/2
    // Also check out https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
    async function handleFile(file) {
        return new Promise((resolve, reject) => {         
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            }
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    async function handleChange(event) {

        let fileSources = (Object.values(event.target.files))
        let fileNames = (Object.values(event.target.files).map(file => file.name));

        fileSources = await Promise.all(fileSources.map(file => {
            const fileSrc = handleFile(file);
            return fileSrc;
        })).then(data => data)

        let files = [];

        for (let srcNameIndex = 0; srcNameIndex < fileSources.length; srcNameIndex++) {
            // Putting each file into an object will allow us to 
            // include the name of the file and display it

            files.push(
                {
                    fileName: fileNames[srcNameIndex],
                    fileSrc: fileSources[srcNameIndex]
                }
            )
        }

        console.log(files)

        files = files
        .map(file => {
            
            const fileRevisedSrcObj = 

            {
                id: uuid(),
                fileName: file.fileName,
                fileSrc: file.fileSrc
            }

            return fileRevisedSrcObj;
        })

        if (backgroundCount + files.length > rounds) {
            let availableBackgroundSlotsForImports = rounds - backgroundCount;
            files = files.slice(0, availableBackgroundSlotsForImports)
        }

        let newBackgroundsArr = [...importBackgrounds, ...files];

        setImportBackgrounds([...newBackgroundsArr]);

    }

    function handleDelete(event) {
        if (event.target.className.includes('background-import')) { 
            const newImportedBackgrounds = 
            importBackgrounds
            .filter(background => background.fileName !== event.target.value);
            setImportBackgrounds([...newImportedBackgrounds]);
        }
    }

    function handleClear() {
        setImportBackgrounds([]);
    }

    let fileSources = importBackgrounds.map(symbol => {
        return symbol.fileSrc;
    })

    return (
        <div className="custom-settings-inner-window-display">
            <section>
                <h2>NOTE:</h2>

                <div>
                    <p>File must be in the .gif, .svg, .jpeg, or .png format</p>
                    <p>Multiple images added will be rotated each round</p> 
                </div>
                
                <button 
                    type="button"
                    onClick={handleClear}
                >
                        Clear Choices
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
            
            <section>
                <div>
                    <label id="file-label-button" htmlFor="file">
                        Browse Files...
                    </label>

                    <input 
                        type="file" 
                        id="file" 
                        accept=".hdr" 
                        multiple 
                        onChange={handleChange}
                        disabled={backgroundCount === rounds ? true : false}
                    />
                </div>
            </section>


            <section className="custom-files-container" id="symbol-files-container">
                {importBackgrounds?.map((file, index) => {
                    return (
                        <div 
                            key={file.fileName + index} 
                            className="custom-single-file-container" 
                            title={file.fileName}
                        >
                            <button 
                                type="button" 
                                className="custom-import-draw-checkbox-button background-import" 
                                id={file.fileName} 
                                onClick={handleDelete}
                                value={file.fileName}
                            >
                                {fileSources.includes(file.fileSrc) && <Checkmark />}
                            </button>

                            <label 
                                className="custom-single-file-container-label" 
                                htmlFor={file.fileName}
                            >
                                {file.fileName}
                            </label>
                        </div>
                    )
                })}
            </section>
        </div>
    )
}