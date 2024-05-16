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
            setTimerFlag(true);
            timeoutId.current = setTimeout(async () => {
                await sendViews(reference_code);
            }, (duration - timeRemaining.current.currentTime) * 1000);
        } else {
            resumeTimer(duration, reference_code);
        }
    };

    const pauseTimer = () => {
        clearTimeout(timeoutId.current);
    };

    const resumeTimer = (duration, reference_code) => {
        timeoutId.current = setTimeout(async () => {
            await sendViews(reference_code);
        }, (duration - timeRemaining.current.currentTime) * 1000);
    };

    return {
        sendViews,
        startTimer,
        pauseTimer,
        resumeTimer,
        timeRemaining,
    };
}
