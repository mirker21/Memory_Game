import { useContext } from "react"
import { GameSettingsContext, AllCustomLayoutShapesContext, GameStatusContext, TimelineEntryContext, DisplayContext } from "../../Game";

export default function GameOverWinner() {

    const {
        setMode,
        setRounds,
        setTime,
        setPeekingLimit,
        setTileDimensions,
        setLayoutShapes,
        setSymbols,
        setSymbolColors,
        setBackgrounds,
    } = useContext(GameSettingsContext);

    const {
        setPresetLayouts, 
        setImportLayouts, 
        setDrawLayouts
    } = useContext(AllCustomLayoutShapesContext);

    const {setGameStatus} = useContext(GameStatusContext);
    const {setTimelineEntry} = useContext(TimelineEntryContext);
    const {setDisplay} = useContext(DisplayContext);

    // If the user decides to play again, 
    // the same settings will get reused.
    // Otherwise, the settings will be cleared.
    function handleClick(event) {

        if (event.target.id === 'play-again-button') {

            setGameStatus('');
            setTimelineEntry(
                {
                    mode: '',
                    status: '',
                    time: [],
                    tileCount: [],
                    mistakeCount: []
                }
            );
            setDisplay('gameboard');

        } else if (event.target.id === 'title-screen-button') {

            setGameStatus('');
            setTimelineEntry(
                {
                    mode: '',
                    status: '',
                    time: [],
                    tileCount: [],
                    mistakeCount: []
                }
            );
            setMode('');
            setRounds(1);
            setTime(
                {
                    min: 1,
                    sec: 0
                }
            );
            setPeekingLimit(0);
            setTileDimensions(
                {
                    w: 2,
                    h: 2
                }
            );
            setLayoutShapes([]);
            setSymbols([]);
            setSymbolColors([]);
            setBackgrounds([]);
            setPresetLayouts([]) 
            setImportLayouts([]) 
            setDrawLayouts([])

            setDisplay('title_screen');

        }

    }

    return (
        <div id="game-over-loser"> 
            <img 
                id="game-over-letters-gif" 
                src="./Lottie_Animations/Game_Over_Animation.gif" 
                alt="GAME OVER!" 
            />

            <div id="game-over-info-container">
                <h2 >Better Luck Next Time!</h2>

                <section id="game-over-buttons-container">
                    <button 
                        type="button" 
                        id="play-again-button" 
                        onClick={handleClick} 
                    >
                        Try Again
                    </button>

                    <button 
                        type="button" 
                        id="title-screen-button" 
                        onClick={handleClick} 
                    >
                        Back To Title Screen
                    </button>
                </section>
            </div>
      </div>
    )
}
