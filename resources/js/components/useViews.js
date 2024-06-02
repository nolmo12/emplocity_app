import React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import authUser from "./authUser";
import { reference } from "@popperjs/core";
export default function useViews() {
    const [timerFlag, setTimerFlag] = useState(false);
    const timeRemaining = useRef(0);
    const sendFlag = useRef(false);
    const intervald = useRef(null);
    const currentTime = useRef(0);
    const timeToSend = useRef();
    const { http } = authUser();
    const { reference_code } = useParams();

    useEffect(() => {
        currentTime.current = 0;
    }, [reference_code]);
    const sendViews = async () => {
        try {
            await http.post(`/api/video/addView/${reference_code}`);
        } catch (error) {
            console.error(error);
        }
    };

    const startTimer = (duration, startTime = 0) => {
        timeToSend.current = duration;
        if (timerFlag === false) {
            setTimerFlag(true);
            timer(timeToSend.current);
        } else {
            resumeTimer(reference_code);
        }
    };

    const pauseTimer = () => {
        if (intervald.current) {
            clearInterval(intervald.current);
            intervald.current = null;
        }
    };

    const resumeTimer = () => {
        timer(timeToSend.current, currentTime.current);
    };

    const updateRemainingTime = (currentTime, totalDuration) => {
        timeRemaining.current = totalDuration - currentTime;
    };

    const timer = (duration) => {
        intervald.current = setInterval(async () => {
            currentTime.current += 0.1;
            if (currentTime.current >= duration && sendFlag.current === false) {
                clearInterval(intervald.current);
                sendFlag.current = true;
                await sendViews(reference_code);
                return;
            }
        }, 100);
    };

    return {
        sendViews,
        startTimer,
        pauseTimer,
        resumeTimer,
        updateRemainingTime,
        timeRemaining,
        currentTime,
    };
}
