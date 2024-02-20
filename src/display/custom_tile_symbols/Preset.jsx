import Checkmark from "../../components/Checkmark";

export default function Preset(
    {
        presetSymbols, 
        setPresetSymbols, 
        imagePresetFileNames,
    }
) {

    function handlePresetSymbolsChange(event) {
        if (event.target.className.includes('custom-import-draw-checkbox-button')) {

            if (presetSymbols.includes(event.target.value)) {
                let newPresetSymbols = presetSymbols.filter(fileName => 
                    fileName !== event.target.value
                )
                setPresetSymbols([...newPresetSymbols])
            } else {
                setPresetSymbols([...presetSymbols, event.target.value]);
            }

        } 
    }

    function handleClear() {
        setPresetSymbols([]);
    }

    return (
        <div className="custom-settings-inner-window-display">
            <section>
                <h2>NOTE:</h2>
                <div>
                    <p>
                        If not enough symbols are chosen, 
                        some extra will be randomly chosen.
                    </p>

                    <p>
                        In some cases, the tile count will be too small for 
                        all symbols to be included.
                    </p>
                </div>
                
                <button 
                    type="button" 
                    onClick={handleClear}
                >
                        Clear Choices
                </button>
            </section>

            <section className="custom-files-container">
                {imagePresetFileNames?.map((fileName, index) => {
                    return (
                        <div 
                            key={fileName + index} 
                            className="custom-single-file-container" 
                            title={
                                fileName
                                .replace('/public/presets_library/symbol_presets/', '')
                                .replace('.svg', '')
                                .replace(/_/g, ' ')
                            }
                        >
                            <button 
                                type="button" 
                                className="
                                    custom-import-draw-checkbox-button 
                                    symbol-character" 
                                id={fileName} 
                                onClick={handlePresetSymbolsChange}
                                value={fileName}
                            >
                                {presetSymbols.includes(fileName) && <Checkmark />}
                            </button>

                            <label className="custom-symbol-label" htmlFor={fileName}>
                                {
                                    fileName
                                    .replace('/public/presets_library/symbol_presets/', '')
                                    .replace('.svg', '')
                                    .replace(/_/g, ' ')
                                }

                                <img 
                                    className="custom-symbol-image-preview" 
                                    src={fileName} 
                                    alt={
                                        fileName
                                        .replace('/public/presets_library/symbol_presets/', '')
                                        .replace('.svg', '')
                                        .replace(/_/g, ' ')
                                    } 
                                />
                            </label>
                        </div>
                    )
                })}
            </section>
        </div>
    )
}
