import React from "react";
import { useEffect, createContext, useState } from "react";

import Header from './Header'
import Display from './Display'

export const GameStatusContext = createContext(null);
export const GameSettingsContext = createContext(null);
export const DisplayContext = createContext(null);
export const AllCustomLayoutShapesContext = createContext(null);
export const TimelineEntryContext = createContext(null);

export default function Game() {
    const [timelineEntry, setTimelineEntry] = useState(
        {
            mode: '',
            status: '',
            time: [],
            rounds: {current: 0, total: 0},
            tileCount: [],
            peekingCount: [],
            mistakeCount: [],
        }
    )
    const [gameStatus, setGameStatus] = useState('');
    const [display, setDisplay] = useState('title_screen');
    
    const [presetLayouts, setPresetLayouts] = useState([]);
    const [importLayouts, setImportLayouts] = useState([]);
    const [drawLayouts, setDrawLayouts] = useState([]);
    
    const [mode, setMode] = useState('');
    const [rounds, setRounds] = useState(1);
    const [time, setTime] = useState(
        {
            min: 1,
            sec: 0
        }
    );
    const [peekingLimit, setPeekingLimit] = useState(0);
    const [tileDimensions, setTileDimensions] = useState(
        {
            w: 2,
            h: 2
        }
    );
    const [layoutShapes, setLayoutShapes] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [symbolColors, setSymbolColors] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);

    // Beforehand, gameSettings was a state
    // containing a large, deeply nested object
    // passed as the value through 
    // GameSettingsContext.Provider 
    // that would carry all of the game settings
    // that the Gameboard would eventually use.

    // However, it became too complicated 
    // to read and update across the 
    // many game settings components.

    // Now, the value passed to GameSettingsContext.Provider
    // is an object containing multiple individual 
    // game settings states and their setter functions.
    
    // That way, you can pick and choose which game
    // settings you would like to read or update
    // without having to work around the 
    // rest of the game settings.

    let gameSettingsObj = {
        mode,
        setMode,
        rounds,
        setRounds,
        time,
        setTime,
        peekingLimit,
        setPeekingLimit,
        tileDimensions,
        setTileDimensions,
        layoutShapes,
        setLayoutShapes,
        symbols,
        setSymbols,
        symbolColors,
        setSymbolColors,
        backgrounds,
        setBackgrounds
    }   

    const allTileLayoutGetterSetters = {
        presetLayouts, 
        setPresetLayouts, 
        importLayouts, 
        setImportLayouts, 
        drawLayouts, 
        setDrawLayouts
    }

    let isHeaderVisible = true;

    if (display.includes('game_over') || display.includes('title_screen')) {
        isHeaderVisible = false;
    }

    useEffect(() => {
        
        const newTimelineEntryDate = new Date().toLocaleString('en-US');
        // Every time the game is over, the timeline data updates.

        if (gameStatus === 'win') {
            // set sessionStorage
            const newTimelineEntry = JSON.stringify({...timelineEntry})
            sessionStorage.setItem(newTimelineEntryDate, newTimelineEntry)
            setGameStatus('')
        } else if (gameStatus === 'lose') {
            // set sessionStorage
            const newTimelineEntry = JSON.stringify({...timelineEntry})
            sessionStorage.setItem(newTimelineEntryDate, newTimelineEntry)
            setGameStatus('')
        }

        return () => {};

    }, [gameStatus])

    return (
        <GameStatusContext.Provider value={{gameStatus, setGameStatus}}>
            <GameSettingsContext.Provider value={gameSettingsObj}>
                <DisplayContext.Provider value={{display, setDisplay}}>
                    <AllCustomLayoutShapesContext.Provider value={allTileLayoutGetterSetters}>
                        <TimelineEntryContext.Provider value={{timelineEntry, setTimelineEntry}}>
                            {isHeaderVisible && <Header />}
                            <Display display={display} />
                        </TimelineEntryContext.Provider>
                    </AllCustomLayoutShapesContext.Provider>
                </DisplayContext.Provider>
            </GameSettingsContext.Provider>
        </GameStatusContext.Provider>
    )
}