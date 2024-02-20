import { useState } from "react"

import OptionDisplay from "./OptionDisplay"

export default function ARaceAgainstTimeCustomGameOptions() {
    const [optionDisplay, setOptionDisplay] = useState('rounds')

    return (
        <article id="custom-game-options-menu">
            <div id="custom-game-options-buttons-container">
                <button 
                    className={
                            optionDisplay === 'rounds' 
                        ? "highlighted-option-button" 
                        : ""
                    } 
                    onClick={() => setOptionDisplay('rounds')}
                >
                    Rounds
                </button>
                
                <button 
                    className={
                        optionDisplay === 'time' 
                        ? "highlighted-option-button" 
                        : ""
                    } 
                    onClick={() => setOptionDisplay('time')}
                >
                    Time
                </button>
                
                <button 
                    className={
                        optionDisplay === 'peeking_limit' 
                        ? "highlighted-option-button" 
                        : ""
                    } 
                    onClick={() => setOptionDisplay('peeking_limit')}
                >
                    Peeking Limit
                </button>
                
                <button 
                    className={
                        optionDisplay === 'tile_dimensions' 
                        ? "highlighted-option-button" 
                        : ""
                    } 
                    onClick={() => setOptionDisplay('tile_dimensions')}
                >
                    Tile Dimensions
                </button>
                
                <button 
                    className={
                        optionDisplay === 'layout_shape' 
                        ? "highlighted-option-button" 
                        : ""
                    } 
                    onClick={() => setOptionDisplay('layout_shape')}
                >
                    Layout Shape
                </button>
                
                <button 
                    className={
                        optionDisplay === 'symbols' 
                        ? "highlighted-option-button" 
                        : ""
                    } 
                    onClick={() => setOptionDisplay('symbols')}
                >
                    Symbols
                </button>
                
                <button 
                    className={
                        optionDisplay === 'background' 
                        ? "highlighted-option-button" 
                        : ""
                    } 
                    onClick={() => setOptionDisplay('background')}
                >
                    Background
                </button>
            </div>

            <div className="custom-game-options-current-option">
                <OptionDisplay optionDisplay={optionDisplay} /> 
            </div>
        </article>
    )
}