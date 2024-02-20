import CustomBackground from './display/custom_background/CustomBackground'
import CustomGameOptions from './display/custom_game_options/CustomGameOptions'
import CustomTileLayout from './display/custom_tile_layout/CustomTileLayout'
import CustomTileSymbols from './display/custom_tile_symbols/CustomTileSymbols'
import GamePresetsOptions from './display/game_presets_options/GamePresetsOptions'
import Gameboard from './display/gameboard/Gameboard'
import GameModeOptions from './display/GameModeOptions'
import GameOver from './display/game_over/GameOver'
import GameOverWinner from './display/game_over/GameOverWinner'
import TitleScreen from './display/TitleScreen'

export default function Display({display}) {

    switch (display) {
        case 'custom_background':
            return (
                <div className="display-container">
                    <CustomBackground />
                </div>
            );

        case 'custom_game_options':
            return (
                <div className="display-container">
                    <CustomGameOptions />
                </div>
            );

        case 'custom_tile_layout':
            return (
                <div className="display-container">
                    <CustomTileLayout />
                </div>
            );

        case 'custom_tile_symbols':
            return (
                <div className="display-container">
                    <CustomTileSymbols />
                </div>
            );

        case 'game_presets_options':
            return (
                <div className="display-container">
                    <GamePresetsOptions />
                </div>
            );

        case 'gameboard':
            return (
                <div className="display-container">
                    <Gameboard />
                </div>
            );

        case 'game_mode_options':
            return (
                <div className="display-container">
                    <GameModeOptions />
                </div>
            );

        case 'game_over':
            return (
                <div className="display-container">
                    <GameOver />
                </div>
            );

        case 'game_over_winner':
            return (
                <div className="display-container">
                    <GameOverWinner />
                </div>
            );

        case 'title_screen':
            return (
                <div className="display-container">
                    <TitleScreen />
                </div>
            );
            
    }
}