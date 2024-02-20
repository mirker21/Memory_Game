export default function QuitModal({handleQuitModalClick}) {
    return (
        <div id="quit-modal">
            <h3>Quit Game?</h3>

            <p>Data for this current game will be lost</p>

            <div>
                <button 
                    type="button" 
                    id="quit-modal-yes-button" 
                    onClick={handleQuitModalClick}
                >
                    Yes
                </button>

                <button 
                    type="button" 
                    id="quit-modal-no-button" 
                    onClick={handleQuitModalClick}
                >
                    No
                </button>
            </div>
        </div>
    )
}