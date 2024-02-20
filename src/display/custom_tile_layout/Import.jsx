import { v4 as uuid } from 'uuid';

import { useRef, useContext } from "react";

import { GameSettingsContext } from "../../Game";

import Checkmark from '../../components/Checkmark';

export default function Import({importLayouts, setImportLayouts, layoutCount}) {

    const canvasRef = useRef(null);

    const {rounds} = useContext(GameSettingsContext);

    // To load the png as base64 
    // Many thanks to James_Hibbard from https://www.sitepoint.com/community/t/filereader-api-getting-image-width/29254/2
    // Also check out https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
    async function handleFile(file) {
        // FileReader prevents the path of the image from
        // starting with "fakePath" and therefore the
        // images can be used and displayed

        return new Promise((resolve, reject) => {
            // Because we are checking for width and height,
            // we need such properties to be accessible
            // through an Image object.

            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image;
                img.src = reader.result;
                resolve(img); 
            }
            reader.onerror = reject;
            reader.readAsDataURL(file);
        })
    }

    // To draw the base64 png on the canvas 
    // and create nested array from alpha data
    // Many thanks to https://stackoverflow.com/questions/72295089/html-canvas-pixel-manipulation-and-alpha-channel
    // Many thanks to https://stackoverflow.com/questions/11228987/image-map-by-alpha-channel
    // Many thanks to https://stackoverflow.com/questions/17615876/how-to-get-the-color-of-a-pixel-from-image
    // Many thanks to https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
    // Also check out https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
    const convertImports = async function (canvasRef, fileSources, fileNames) {

        let convertedLayouts = []; 

        const importLayoutsNames = [...fileSources];

        if (importLayoutsNames.length > 0) {

            for (let importIndex = 0; importIndex < importLayoutsNames.length; importIndex++) {

                // Many thanks to this post https://stackoverflow.com/a/66180709/18628118  
                // for solving images not being loaded right away.

                let newConvertedImport = await new Promise((resolve, reject) => {
                    
                    const newImport = [];

                    let img = new Image();
                    img.crossOrigin='Anonymous';
                    
                    let ctx = canvasRef.current.getContext(
                        '2d', 
                        { 
                            alpha: true, 
                            desynchronized: false, 
                            colorSpace: 'srgb', 
                            willReadFrequently: true
                        }
                    )
                    ctx.translate(16, 16)
                    ctx.rotate(Math.PI)
                    ctx.globalCompositeOperation = "copy";

                    let imageData;

                    img.onload = async function () {

                        ctx.width = img.width;
                        ctx.height = img.height;

                        if (ctx.width !== 16 && ctx.height !== 16) {
                            reject([]);
                        }
                        
                        await ctx.drawImage(img, 0, 0);
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

                            newImport.push(newRow)

                        }

                        resolve(newImport)

                    }

                    img.src = importLayoutsNames[importIndex];


                }).then(data => data)

                convertedLayouts.push(
                    {
                        fileName: fileNames[importIndex],
                        fileSrc: newConvertedImport
                    }
                );

            }

        }

        return convertedLayouts;

    }

    // To add any new imported files to importLayouts
    const handleChange = async function (event) {
        
        let fileSources = (Object.values(event.target.files))
        let fileNames = (Object.values(event.target.files).map(file => file.name));
        
        fileSources = await Promise.all(fileSources.map(file => {
            const fileSrc = handleFile(file);
            return fileSrc;
        }))

        fileSources = fileSources.map(file => file.currentSrc)
        
        let convertedImports = await convertImports(canvasRef, fileSources, fileNames)
        .then(data => data);


        convertedImports = convertedImports.filter(file => {
            // to ensure that tileCount for each layout remains under 70.
            const tileCount = 
            file['fileSrc']
            .reduce((total, row) => 
            total += row.reduce((total, tile) => total += tile, 0), 0);
            console.log(file['fileName'], tileCount)
            return file['fileSrc'].length > 0 && tileCount <= 70 && tileCount % 2 === 0;
        })
        
        console.log(convertedImports)

        // It wouldn't make sense to include layouts 
        // that the user will never see.

        if (layoutCount + convertedImports.length > rounds) {
            let availableLayoutSlotsForImports = rounds - layoutCount;
            convertedImports = convertedImports.slice(0, availableLayoutSlotsForImports)
        }

        // beforehand, checkDuplicatesArr eliminated 
        // duplicates in name and src by converting each array
        // element into a string and putting all of these strings
        // into a Set. 

        // However, to allow more freedom with  
        // customization, duplicates are now allowed,
        // because a user might want to have a series
        // of rounds that uses a sequence of layouts 
        // that repeats.

        convertedImports = convertedImports.map(file => {
            file['id'] = uuid();
            return file;
        })

        let newLayoutsArr = [...importLayouts, ...convertedImports];

        setImportLayouts([...newLayoutsArr]);

    }

    function handleDeleteOneLayout(event) {
        const newImportLayouts = importLayouts.filter(layout => {
            if (layout.id !== event.target.id) {
                return layout;
            }
        })
        
        setImportLayouts(newImportLayouts)
    }

    function handleClearImportLayouts() {
        setImportLayouts([])
    }

    return (
        <div className="custom-settings-inner-window-display">
            <canvas 
                id="import-layout-canvas" 
                ref={canvasRef} 
                width="16" 
                height="16"
            >  
            </canvas>

            <section>
                <h3>Note:</h3>

                <p>Files must be in the .png format</p>
                <p>
                    Image dimensions must be (16x16) pixels, 
                    and the total number of highlighted pixels 
                    cannot exceed 70 total tiles
                </p>
                <p>
                    The total of Highlighted tiles Must add up to an even number, 
                    otherwise the game cannot end by getting all matches
                </p>
                <p>Multiple layouts added will be rotated each round</p>

                {
                    layoutCount === rounds 
                    && 
                    <p className="warn">
                        The number of layouts you chose equals the number 
                        of rounds you set. If you would like to add more 
                        layouts, increase the number of rounds.
                    </p>
                }
                
                <button type="button" onClick={handleClearImportLayouts}>
                    Clear Choices
                </button>
            </section>
            
            <section>

                <div>
                    <label id="file-label-button" htmlFor="file">
                        Browse Files...
                    </label>

                    <input 
                        type="file" 
                        accept=".png" 
                        id="file" 
                        multiple
                        onChange={handleChange} 
                        disabled={layoutCount === rounds ? true : false}
                    />
                </div>
            
                <section className="custom-files-container">
                    {
                        importLayouts?.map((layout, index) => {
                            return (
                                <div 
                                    key={layout.fileName + index} 
                                    className="custom-single-file-container" 
                                    title={
                                        layout.fileName
                                        .replace('.png', '')
                                        .replace(/_/g, ' ')
                                    }
                                >
                                    <button 
                                        type="button" 
                                        className="custom-import-draw-checkbox-button" 
                                        id={layout.id} 
                                        onClick={handleDeleteOneLayout}
                                    >
                                        <Checkmark />
                                    </button>
                                    <label 
                                        className="custom-single-file-container-label" 
                                        id={layout.fileName}
                                    >
                                        {
                                            layout.fileName
                                            .replace('.png', '')
                                            .replace(/_/g, ' ')
                                        }
                                    </label>
                                </div>
                            )
                        })
                    }    
                </section>
            </section>
        </div>
    )
}