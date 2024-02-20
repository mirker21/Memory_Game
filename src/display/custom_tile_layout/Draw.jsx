import { v4 as uuid } from 'uuid';

import { useState, useContext } from "react";

import { GameSettingsContext } from "../../Game";

import Checkmark from '../../components/Checkmark';

export default function Draw({drawLayouts, setDrawLayouts, layoutCount}) {

    const {rounds} = useContext(GameSettingsContext);

    const [currentLayoutName, setCurrentLayoutName] = useState('');
    const [currentGrid, setCurrentGrid] = useState([
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
        [...new Array(16).fill(0)],
    ]);

    function handleClearCurrentGrid() {
        setCurrentLayoutName('');
        setCurrentGrid([
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
            [...new Array(16).fill(0)],
        ]);
    }

    function handleChangeTileSelection(event) {
        const tile = event.target.id.split(' ');
        const rowIndex = parseInt(tile[0]);
        const itemIndex = parseInt(tile[1]);

        const newGrid = [...currentGrid];

        if (newGrid[rowIndex][itemIndex] === 1) {
            newGrid[rowIndex][itemIndex] = 0;
        } else if (newGrid[rowIndex][itemIndex] === 0) {
            newGrid[rowIndex][itemIndex] = 1;
        }

        setCurrentGrid([...newGrid]);
    }

    function handleLayoutNameChange(event) {
        setCurrentLayoutName(event.target.value);
    }

    function handleAddLayout() {
        
        if (tileCount % 2 === 0) {

            const newLayout = {
                id: uuid(),
                name: currentLayoutName,
                layout: currentGrid
            }
            setDrawLayouts([...drawLayouts, newLayout]);
            setCurrentLayoutName('');
            setCurrentGrid([
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
                [...new Array(16).fill(0)],
            ]);

        }

    }

    function handleDeleteLayout(event) {
        const newDrawLayouts = drawLayouts.filter(layout => {
            if (layout.id !== event.target.id) {
                return layout;
            }
        })
        
        setDrawLayouts(newDrawLayouts)
    }

    function handleClearDrawLayouts() {
        setDrawLayouts([])
    }

    let tileCount = 0;

    currentGrid.forEach(row => {
        row.forEach(item => {
            if (item === 1) {
                tileCount += 1;
            }
        })
    })

    return (
        <div className="custom-settings-inner-window-display">
            <section>
                <div id="custom-tile-layout-draw-canvas">
                    {
                        currentGrid.map((row, rowIndex) => {
                            return (
                                <div 
                                    className="custom-tile-layout-draw-single-row" 
                                    key={rowIndex} 
                                >
                                    {row.map((item, itemIndex) => (
                                        <input
                                            className="custom-tile-layout-draw-single-tile" 
                                            type="checkbox" 
                                            key={`${rowIndex} ${itemIndex}`} 
                                            id={`${rowIndex} ${itemIndex}`} 
                                            onChange={
                                                (
                                                    layoutCount !== rounds 
                                                    && 
                                                    tileCount < 70
                                                )
                                                ? 
                                                handleChangeTileSelection 
                                                : 
                                                () => {}
                                            }
                                            checked={
                                                currentGrid[rowIndex][itemIndex] === 1 
                                                ? 
                                                true 
                                                : 
                                                false
                                            }
                                            value={item}
                                        />
                                    ))}
                                </div>
                            )
                        })
                    }
                </div>
            </section>

            <section className="custom-note-box">
                <h3>Note:</h3>

                <p>The tile count cannot exceed 70 and cannot go below 2</p>
                <p>The total of highlighted tiles must add up to an even number</p>
                <p>Multiple layouts added will be rotated each round</p>


                {
                    tileCount === 0 
                    && 
                    <p>
                        Please select tiles to add a new layout.
                    </p>
                }
                {
                    tileCount % 2 !== 0 
                    && 
                    <p className="warn">
                        The number of tiles you chose is odd. 
                        Select/deselect one more tile to make it even.
                    </p>
                }
                {
                    layoutCount === rounds 
                    && 
                    <p className="warn">
                        The number of layouts you chose equals the number 
                        of rounds you set. If you would like to add more 
                        layouts, increase the number of rounds.
                    </p>
                }

                <div id="draw-clear-buttons-container">
                    <button type="button" onClick={handleClearDrawLayouts}>
                        Clear Choices
                    </button>

                    <button type="button" onClick={handleClearCurrentGrid}>
                        Clear Board
                    </button>
                </div>
            </section>


            <section id="custom-tile-layout-draw-canvas">
                <label htmlFor="custom-tile-layout-draw-name-input">
                    Name of Layout
                </label>

                
                <input 
                    type="text" 
                    id="custom-tile-layout-draw-name-input" 
                    onChange={handleLayoutNameChange} 
                    value={currentLayoutName} 
                    disabled={layoutCount === rounds} 
                />


                <div className="custom-files-container">
                    {
                        drawLayouts?.map((layout, index) => {
                            return (
                                <div 
                                key={layout.name + index} 
                                className="custom-single-file-container" 
                                title={layout.name}
                                >
                                    <button 
                                        type="button" 
                                        className="custom-import-draw-checkbox-button" 
                                        id={layout.id} 
                                        onClick={handleDeleteLayout}
                                    >
                                        <Checkmark />
                                    </button>

                                    <label 
                                        className="custom-single-file-container-label" 
                                        id={layout.name}
                                    >
                                        {layout.name}
                                    </label>
                                </div>
                            )
                        })
                    }    
                </div>
                
                {
                    (
                        layoutCount !== rounds 
                        && 
                        tileCount % 2 === 0 
                        && 
                        tileCount !== 0 
                        && 
                        currentLayoutName.length !== 0
                    ) 
                    &&
                    <button onClick={handleAddLayout}>
                        Add Layout
                    </button>
                }
            </section>      
        </div>
    )
}