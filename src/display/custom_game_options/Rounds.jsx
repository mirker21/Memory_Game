import { useContext } from "react";

import { GameSettingsContext } from "../../Game";

export default function Rounds() {
    const {rounds, setRounds} = useContext(GameSettingsContext);

    function handleIncrement() {

        if (typeof rounds === 'number') {
            setRounds(rounds + 1);
        } else {
            setRounds(1)
        }

    }
    
    function handleDecrement() {

        if (typeof rounds === 'number' && rounds > 1) {
            setRounds(rounds - 1);
        } else {
            setRounds(1)
        }

    }

    function handleRoundsChange(event) {

        if (
            event.target.value !== '' 
            && !event.target.value.includes('-') 
            && Math.sign(event.target.value) !== 0 
            && Math.sign(event.target.value) !== -1
        ) {
            setRounds(parseInt(event.target.value));
        } else {
            setRounds(1);
        }
    }

    return (
        <section>
            <div className="increment-decrement-buttons-container">
                <button 
                    id="custom-rounds-increment-button" 
                    onClick={handleIncrement}
                >
                    +
                </button>

                <hr />

                <button 
                    id="custom-rounds-decrement-button" 
                    onClick={handleDecrement}
                >
                    -
                </button>
            </div>
            
            <input 
                type="number" id="custom-rounds-input" 
                onChange={handleRoundsChange} 
                value={rounds} 
            />
        </section>
    )
}