import { useContext } from "react"

import { DisplayContext } from "../../Game"

export default function Symbols() {
    const {setDisplay} = useContext(DisplayContext);
    
    return (
        <section id="custom-game-options-symbol-option-display">
            <p>
                You can either choose from presets 
                in the game, or import your own. 
            </p>

            <p>
                Otherwise, the game will use random 
                letters, numbers, colors, and the 
                symbols from the presets library.
            </p>

            <button onClick={() => setDisplay('custom_tile_symbols')}>
                Customize Symbols and Colors
            </button>
        </section>
    )
}