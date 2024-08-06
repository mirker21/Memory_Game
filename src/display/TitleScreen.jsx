import React from 'react';

import { useContext } from 'react';
import { DisplayContext } from '../Game';

export default function TitleScreen() {
    const {setDisplay} = useContext(DisplayContext);

    return (
        <div id="title-screen-container">
            <div id="title-screen-title">
                <img 
                    id="title-screen-letters-gif" 
                    src="./Lottie_Animations/Title.gif" 
                    alt="" 
                />
            </div>

            <button 
                id="title-screen-start-game-button" 
                onClick={() => setDisplay('game_mode_options')}
            >
                Start Game
            </button>
        </div>
    )
}
