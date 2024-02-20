import { useState, useContext } from "react";

import { GameSettingsContext } from "../../Game";
import { DisplayContext } from "../../Game";

import Easy from "./Easy";
import Medium from "./Medium";
import Hard from "./Hard";

export default function GamePresetsOptions() {
    const {mode} = useContext(GameSettingsContext);
    const {setDisplay} = useContext(DisplayContext);

    const [currentGamePresetDisplay, setCurrentGamePresetDisplay] = useState('easy');

    function handleClick(event) {
        if (event.target.id === 'game-preset-easy') {
            setCurrentGamePresetDisplay('easy');
        } else if (event.target.id === 'game-preset-medium') {
            setCurrentGamePresetDisplay('medium');
        } else if (event.target.id === 'game-preset-hard') {
            setCurrentGamePresetDisplay('hard');
        } else if (event.target.id === 'custom-game-button') {
            setDisplay('custom_game_options');
        } else if (event.target.className === 'back-button') {
            setDisplay('game_mode_options');
        }
    }

    let openedGamePreset;

    // Displays settings for difficulty
    
    if (currentGamePresetDisplay === 'easy') {
        openedGamePreset = <Easy />;
    } else if (currentGamePresetDisplay === 'medium') {
        openedGamePreset = <Medium />;
    } else if (currentGamePresetDisplay === 'hard') {
        openedGamePreset = <Hard />;
    }

    return (
        <div id="game-presets-options-menu-container">        
            <div className="title-back-button-container">
                <button className="back-button" onClick={handleClick}>
                    &larr;
                </button>

                <h2>Mode - {mode.replace(/_/g, ' ')}</h2>
            </div>

            <article>
                <section>
                    <h3>Game Presets</h3>

                    <p>Pick a preset time/tile count, or make your own!</p>

                    <div className="buttons-container">
                        <button 
                            className={
                                currentGamePresetDisplay === 'easy' 
                                ? 
                                "highlighted-option-button" 
                                : 
                                ""
                            } 
                            id="game-preset-easy" onClick={handleClick}
                        >
                            Easy
                        </button>

                        <button 
                            className={
                                currentGamePresetDisplay === 'medium' 
                                ? 
                                "highlighted-option-button" 
                                : 
                                ""
                            } 
                            id="game-preset-medium" onClick={handleClick}
                        >
                            Medium
                        </button>

                        <button 
                            className={
                                currentGamePresetDisplay === 'hard' 
                                ? 
                                "highlighted-option-button" 
                                : 
                                ""
                            } 
                            id="game-preset-hard" onClick={handleClick}
                        >
                            Hard
                        </button>

                        <button id="custom-game-button" onClick={handleClick}>
                            Custom
                        </button>
                    </div>
                </section>

                {openedGamePreset}
            </article>
        </div>
    )
}