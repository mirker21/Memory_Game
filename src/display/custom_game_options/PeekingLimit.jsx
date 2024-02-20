import { useContext } from "react"

import { GameSettingsContext } from "../../Game";

export default function PeekingLimit() {
    const {peekingLimit, setPeekingLimit} = useContext(GameSettingsContext);

    function handleIncrement() {
        setPeekingLimit(peekingLimit + 1);
    }
    
    function handleDecrement() {
        if (peekingLimit !== 0) {
            setPeekingLimit(peekingLimit - 1);
        } 
    }

    function handlePeekingLimitChange(event) {
        if (
            event.target.value !== '' 
            && !event.target.value.includes('-') 
            && Math.sign(event.target.value) !== -1
        ) {
            setPeekingLimit(event.target.value);
        } else {
            setPeekingLimit(0);
        }
    }

    return (
        <section>
            <div className="increment-decrement-buttons-container">
                <button onClick={handleIncrement}>+</button>

                <hr />

                <button onClick={handleDecrement}>-</button>
            </div>
            
            <input 
                type="number" 
                id="custom-peeking-limit-input" 
                onChange={handlePeekingLimitChange} 
                value={peekingLimit}
            />
        </section>
    )
}