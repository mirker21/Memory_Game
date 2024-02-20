import { useState, useContext } from "react"

import { GameSettingsContext } from "../../Game";

export default function TileDimensions() {
    const {tileDimensions, setTileDimensions} = useContext(GameSettingsContext);
    const [isWidthInputBlurred, setIsWidthInputBlurred] = useState(false);
    const [isHeightInputBlurred, setIsHeightInputBlurred] = useState(false);

    function handleIncrement(event) {

        if (event.target.id === 'custom-tile-dimensions-width-increment-button') {

            if (tileDimensions.w < 8 && isWidthInputBlurred === false) {
                setTileDimensions(
                    {
                        w: tileDimensions.w + 1,
                        h: tileDimensions.h
                    }
                );
            }

            setIsWidthInputBlurred(false);

        } else if (event.target.id === 'custom-tile-dimensions-height-increment-button') {

            if (tileDimensions.h < 8 && isHeightInputBlurred === false) {
                setTileDimensions(
                    {
                        w: tileDimensions.w, 
                        h: tileDimensions.h + 1
                    }
                );
            }

            setIsHeightInputBlurred(false);

        }

    }
    
    function handleDecrement(event) {

        if (event.target.id === 'custom-tile-dimensions-width-decrement-button') {

            if (tileDimensions.w > 2) {
                setTileDimensions(
                    {
                        w: tileDimensions.w - 1,
                        h: tileDimensions.h
                    }
                );
            }
            
        } else if (event.target.id === 'custom-tile-dimensions-height-decrement-button') {

            if (tileDimensions.h > 2) {
                setTileDimensions(
                    {
                        w: tileDimensions.w, 
                        h: tileDimensions.h - 1
                    }
                );
            }

        }

    }

    function handleChange(event) {

        if (event.target.id === 'custom-tile-dimensions-width-input') {

            if (
                event.target.value.length < 3
                && parseInt(event.target.value) <= 8 
                && parseInt(event.target.value) !== 0
                && !event.target.value.includes('-') 
            ) {

                setTileDimensions(
                    {
                        w: parseInt(event.target.value),
                        h: tileDimensions.h
                    }
                );

            } else {

                setTileDimensions(
                    {
                        w: 2,
                        h: tileDimensions.h
                    }
                );

            }
            
        } else if (event.target.id === 'custom-tile-dimensions-height-input') {
            
            if (
                event.target.value.length < 3
                && parseInt(event.target.value) <= 8 
                && parseInt(event.target.value) !== 0
                && !event.target.value.includes('-') 
            ) {

                setTileDimensions(
                    {
                        w: tileDimensions.w,
                        h: parseInt(event.target.value)
                    }
                );

            } else {

                setTileDimensions(
                    {
                        w: tileDimensions.w,
                        h: 2
                    }
                );

            }
        }

    }

    function handleBlur(event) {
        if (event.target.id === 'custom-tile-dimensions-width-input') {

            if (
                parseInt(event.target.value) > 8 
                || parseInt(event.target.value) < 2
                || event.target.value === '' 
            ) 
            
            {
                setTileDimensions(
                    {
                        w: 2,
                        h: tileDimensions.h
                    }
                );
            }

            setIsWidthInputBlurred(true);

        } else if (event.target.id === 'custom-tile-dimensions-height-input') {

            if (
                parseInt(event.target.value) > 8 
                || parseInt(event.target.value) < 2
                || event.target.value === '' 
            ) 
            
            {
                setTileDimensions(
                    {
                        w: tileDimensions.w,
                        h: 2
                    }
                );
            }

            setIsHeightInputBlurred(true);

        }
    }

    return (
        <section id="custom-game-options-tile-dimensions-option-display">
            <article>
                <h3>Note:</h3>
                
                <p>
                    Dimensions of tile layout cannot 
                    exceed (8x8) or go below (2x2)
                </p>
                
                <p>
                    The dimensions that preset layout shapes fit 
                    into will override the custom dimensions set by the user
                </p>
            </article>

            <div>
                <p>Width</p>

                <section>
                    <div className="increment-decrement-buttons-container">
                        <button 
                            id="custom-tile-dimensions-width-increment-button" 
                            onClick={handleIncrement}
                        >
                                +
                        </button>

                        <hr />

                        <button 
                            id="custom-tile-dimensions-width-decrement-button" 
                            onClick={handleDecrement}
                        >
                                -
                        </button>
                    </div>

                    <input 
                        type="number" 
                        id="custom-tile-dimensions-width-input" 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        value={tileDimensions.w} 
                    />
                </section>
            </div>
            
            <div>
                <p>Height</p>

                <section>
                    <div className="increment-decrement-buttons-container">
                        <button 
                            id="custom-tile-dimensions-height-increment-button" 
                            onClick={handleIncrement}
                        >
                            +
                        </button>

                        <hr />

                        <button 
                            id="custom-tile-dimensions-height-decrement-button" 
                            onClick={handleDecrement}
                        >
                            -
                        </button>
                    </div>

                    <input 
                        type="number" 
                        id="custom-tile-dimensions-height-input" 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        value={tileDimensions.h} 
                    />
                </section>
            </div>
        </section>
    )
}