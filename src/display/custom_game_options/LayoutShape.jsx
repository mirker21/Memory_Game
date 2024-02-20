import { useContext } from "react"

import { DisplayContext } from "../../Game"

export default function LayoutShape() {
    const {setDisplay} = useContext(DisplayContext);
    
    return (
        <section id="custom-game-options-layout-shape-option-display">
            <p>
                If nothing is changed in this section, 
                the game will default to a square/rectangle shape.
            </p>
            
            <p>
                If changed, dimensions of the layout will override the set
                layout dimensions.
            </p>
            
            <button onClick={() => setDisplay('custom_tile_layout')}>
                Customize Layout
            </button>
        </section>
    )
}