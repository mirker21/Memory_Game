export default function RoundOverModal({handleRoundOverModalClick}) {

    return (
        <div id="round-over-modal">
            <h3>Round Completed!</h3>

            <p>Continue to next round?</p>

            <div>
                <button 
                    type="button" 
                    id="round-over-modal-continue-button" 
                    onClick={handleRoundOverModalClick}
                >
                    Yes
                </button>

                <button 
                    type="button" 
                    id="round-over-modal-quit-button" 
                    onClick={handleRoundOverModalClick}
                >
                    Quit
                </button>
            </div>
        </div>
    )
}