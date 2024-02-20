import { useContext } from "react"

import { GameSettingsContext } from "../../Game";

export default function Time() {
    const {time, setTime} = useContext(GameSettingsContext);

    function handleIncrement(event) {
        if (event.target.id === 'custom-time-minutes-increment-button') {
            
            setTime(
                {
                    min: parseInt(time.min) + 1,
                    sec: time.sec
                }
            );

        } else if (
            event.target.id === 'custom-time-seconds-increment-button' 
            && time.sec < 59
        ) {

            setTime(
                {
                    min: time.min,
                    sec: parseInt(time.sec) + 1
                }
            );

        } else if (
            event.target.id === 'custom-time-seconds-increment-button' 
            && time.sec === 59
        ) {

            setTime(
                {
                    min: parseInt(time.min) + 1,
                    sec: 0
                }
            );
            
        }

    }
    
    function handleDecrement(event) {
        if (event.target.id === 'custom-time-minutes-decrement-button') {

            if (time.min >= 1) {
                setTime(
                    {
                        min: parseInt(time.min) - 1,
                        sec: time.sec === 0 ? 59 : time.sec
                    }
                );
            } else if (time.sec === 0 && time.min === 0) {
                setTime(
                    {
                        min: 1,
                        sec: 0
                    }
                );
            }

        } else if (event.target.id === 'custom-time-seconds-decrement-button') {

            if (time.sec > 0) {
                setTime(
                    {
                        min: time.min,
                        sec: parseInt(time.sec) - 1
                    }
                );
            } else if (time.sec === 0 && time.min >= 1) {
                setTime(
                    {
                        min: parseInt(time.min) - 1,
                        sec: 59
                    }
                );
            } else if (time.sec === 0 && time.min === 0) {
                setTime(
                    {
                        min: 1,
                        sec: 0
                    }
                );
            }

        }
    }

    function handleChange(event) {
        if (event.target.id === 'custom-time-minutes-input') {

            if (
                event.target.value !== '' 
                && Math.sign(event.target.value) !== 0
                && Math.sign(event.target.value) !== -1
            ) {
                setTime(
                    {
                        min: parseInt(event.target.value),
                        sec: time.sec === 0 ? 59 : time.sec
                    }
                );
            } else {
                setTime(
                    {
                        min: 1,
                        sec: time.sec
                    }
                );
            }

            if (Math.sign(event.target.value) === 0 && time.sec === 0) {
                setTime(
                    {
                        min: 0,
                        sec: 59
                    }
                );
            }

        } else if (event.target.id === 'custom-time-seconds-input') {

            if (
                event.target.value !== '' 
                && Math.sign(event.target.value) !== 0 
                && Math.sign(event.target.value) !== -1 
                && event.target.value <= 59
            ) {
                setTime(
                    {
                        min: time.min,
                        sec: parseInt(event.target.value)
                    }
                );
            } else {
                setTime(
                    {
                        min: time.min,
                        sec: 0
                    }
                );
            }

            if (Math.sign(event.target.value) === 0 && time.min === 0) {
                setTime(
                    {
                        min: 1,
                        sec: 0
                    }
                );
            }

        }
    }

    return (
        <section id="custom-game-options-time-option-display">
            <div>
                <input 
                    type="number" 
                    id="custom-time-minutes-input" 
                    className="custom-time-input" 
                    maxLength="2" 
                    onChange={handleChange} 
                    value={time.min} 
                />

                <div className="increment-decrement-buttons-container">
                    <button 
                        id="custom-time-minutes-increment-button" 
                        onClick={handleIncrement}
                    >
                        +
                    </button>

                    <hr />

                    <button 
                        id="custom-time-minutes-decrement-button" 
                        onClick={handleDecrement}
                    >
                        -
                    </button>
                </div>
            </div>

            :

            <div>
                <input 
                    type="number" 
                    id="custom-time-seconds-input" 
                    className="custom-time-input" 
                    maxLength="2" 
                    onChange={handleChange} 
                    value={time.sec <= 9 ? '0' + time.sec : '' + time.sec} 
                />
                
                <div className="increment-decrement-buttons-container">
                    <button 
                        id="custom-time-seconds-increment-button" 
                        onClick={handleIncrement}>+</button>

                    <hr />

                    <button 
                        id="custom-time-seconds-decrement-button" 
                        onClick={handleDecrement}>-</button>
                </div>
            </div>
        </section>
    )
}