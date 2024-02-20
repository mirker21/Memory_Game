import React from "react"

import { useContext } from "react"
import { DisplayContext } from "../Game"
import { GameSettingsContext } from "../Game";

export default function GameModeOptions() {
    const {setMode} = useContext(GameSettingsContext);
    const {setDisplay} = useContext(DisplayContext);

    function handleClick(event) {
        if (event.target.className === 'game-mode-option-button') {

            setDisplay('game_presets_options');
            
            if (event.target.id === 'game-mode-classic-button') {
                setMode('classic');
            } else if (event.target.id === 'game-mode-just-chilling-button') {
                setMode('just_chilling');
            } else if (event.target.id === 'game-mode-a-race-against-time-button') {
                setMode('a_race_against_time');
            }

        } else if (event.target.className === 'back-button') {
            setDisplay('title_screen');
            setMode('');
        }
    }

    return (
        <div id="game-mode-options-menu-container">
            <section className="title-back-button-container">
                <button className="back-button" onClick={handleClick}>&larr;</button>

                <h2 id="game-mode-options-page-header">Mode</h2>
            </section>

            <section className="buttons-container">
                <button 
                    className="game-mode-option-button" 
                    id="game-mode-classic-button" 
                    onClick={handleClick}
                >
                    Classic
                </button>

                <button 
                    className="game-mode-option-button" 
                    id="game-mode-just-chilling-button" 
                    onClick={handleClick}
                >
                    Just Chilling
                </button>

                <button 
                    className="game-mode-option-button" 
                    id="game-mode-a-race-against-time-button" 
                    onClick={handleClick}
                >
                    A Race Against Time
                </button>
            </section>

        </div>
    )
}