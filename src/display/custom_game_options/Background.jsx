import { useContext } from "react"

import { DisplayContext } from "../../Game"

export default function Background() {
    const {setDisplay} = useContext(DisplayContext);

    return (
        <section id="custom-game-options-background-option-display">
            <p>
                You can choose from presets in the game, 
                or import your own. Otherwise, it will 
                go to the default background.
            </p>
            
            <button onClick={() => setDisplay('custom_background')}>
                Customize Background
            </button>
        </section>
    )
}