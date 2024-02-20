import { useState, useRef, useContext } from "react"
import Lottie from "lottie-react"
import animationData from "/public/Lottie_Animations/Memory_Game_Winner_Banner_Animation_Lottie.sifz.BF7B0D88.json"
import { 
    GameSettingsContext, 
    AllCustomLayoutShapesContext, 
    GameStatusContext, 
    TimelineEntryContext, 
    DisplayContext 
} from "../../Game";

export default function GameOverWinner() {
    const congratsRef = useRef(null);
    const [isAppearGif, setIsAppearGif] = useState(false)

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
    const handleClick = async function (event) {

        if (event.target.id === 'play-again-button') {

            setGameStatus('');
            setTimelineEntry(
                {
                    mode: '',
                    status: '',
                    time: [],
                    tileCount: [],
                    peekingCount: [],
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
                    peekingCount: [],
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
        <div id="game-over-winner"> 
            <div id="banner-container">
                <img id="congrats-letters-gif" 
                    className={isAppearGif === false ? "hide" : ""} 
                    src="/public/Lottie_Animations/Congrats_Animation.gif" 
                    alt="CONGRATS!" 
                />
                
                <Lottie 
                    animationData={animationData}
                    onComplete={
                        () => {
                            congratsRef.current.setDirection(1);
                            congratsRef.current.play();
                            setIsAppearGif(true)
                        }
                    }
                    lottieRef={congratsRef}
                    className="lottie-congrats"
                    loop={false}
                />
            </div>

            <div id="game-over-info-container">
                <h2 >You Won The Game!</h2>

                <section id="game-over-buttons-container">
                    <button 
                        type="button" 
                        id="play-again-button" 
                        onClick={handleClick} 
                    >
                        Do It Again!
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