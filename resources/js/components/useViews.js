import React from "react";
import { useState, useRef } from "react";
import authUser from "./authUser";
export default function useViews() {
    const [timerFlag, setTimerFlag] = useState(false);
    const timeRemaining = useRef();
    const timeoutId = useRef(null);
    const { http } = authUser();
    const sendViews = async (reference_code) => {
        try {
            http.post(`/api/video/addView/${reference_code}`);
        } catch (error) {
            console.error(error);
        }
    };

    const startTimer = (duration, reference_code) => {
        if (timerFlag === false) {
            console.log("start timer");
            setTimerFlag(true);
            timeoutId.current = setTimeout(async () => {
                console.log("timer expired");
                await sendViews(reference_code);
                setTimerFlag(false); //
            }, duration * 1000);
        } else {
            resumeTimer(duration, reference_code);
        }
    };

    const pauseTimer = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
            timeoutId.current = null;
            setTimerFlag(false);
        }
    };

    const resumeTimer = (remainingDuration, reference_code) => {
        if (!timerFlag) {
            setTimerFlag(true);
            timeoutId.current = setTimeout(async () => {
                await sendViews(reference_code);
                setTimerFlag(false);
            }, remainingDuration * 1000);
        }
    };

    const updateRemainingTime = (currentTime, totalDuration) => {
        timeRemaining.current = totalDuration - currentTime;
    };

    return {
        sendViews,
        startTimer,
        pauseTimer,
        resumeTimer,
        updateRemainingTime,
        timeRemaining,
    };
}
