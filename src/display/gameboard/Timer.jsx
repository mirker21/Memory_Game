import { useEffect } from "react";

export default function Timer(
    {
        mode, 
        startTime, 
        setStartTime, 
        minutes, 
        setMinutes, 
        seconds, 
        setSeconds
    }
) {
    useEffect(() => {

        // Many thanks to https://stackoverflow.com/a/29972322/18628118 for their answer!
        // Many thanks to https://medium.com/@bsalwiczek/building-timer-in-react-its-not-as-simple-as-you-may-think-80e5f2648f9b

        const timer = setInterval(() => {
            // relying on Date keeps track of seconds better
            const newTime = Date.now()
            const delta = Math.floor((newTime - startTime) / 1000)

            // when a second has passed between startTime and newTime,
            // only then subtract a second off of the time.

            if (delta === 1) {

                let newSeconds = seconds - 1;

                if (mode === 'just_chilling') {

                    let newMinutes = minutes;
                    
                    if (seconds > 0) {

                        setSeconds(newSeconds);
                        setMinutes(newMinutes);

                    } else if (seconds === 0) {

                        if (minutes > 0) {
                            newMinutes = minutes - 1;
                            setMinutes(newMinutes);
                            setSeconds(59);
                        } else if (minutes <= 0) {
                            setSeconds(newSeconds);
                        }

                    } else if (seconds < 0 && seconds > -59) {

                        if (minutes <= 0) {
                            setSeconds(newSeconds);
                        }

                    } else if (seconds === -59) {

                        newMinutes = minutes - 1;
                        setMinutes(newMinutes);
                        setSeconds(0);

                    }

                } else {

                    if (newSeconds < 0) {
                        newSeconds = 59;
                        const newMinutes = minutes - 1;
                        setSeconds(newSeconds);
                        setMinutes(newMinutes);
                    } else {
                        setSeconds(newSeconds);
                    }

                }

                setStartTime(Date.now())

            }

            // by having the interval set to 100 ms instead of 1000 ms 
            // prevents the user from being able to pause 
            // the timer by rapidly selecting tiles

        }, 100);

        return () => clearInterval(timer);
    })

    return (
        <div id={mode !== 'just_chilling' ? 'timer' : ''}>
            {   
                mode !== 'just_chilling' 
                &&
                `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
            }
        </div>
    )
}