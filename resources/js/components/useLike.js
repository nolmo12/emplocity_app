import axios from "axios";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useLike() {
    const { http } = authUser();
    const fetchLikes = async (reference_code, setInitialThumbStyle) => {
        try {
            const response = await http.get(
                `/api/video/hasUserLiked/${reference_code}`
            );
            if (response.data === 1) {
                setInitialThumbStyle("like");
            }
            if (response.data === 0) {
                setInitialThumbStyle("dislike");
            }
            if (response.data === null) {
                setInitialThumbStyle(null);
            }
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    const sendLikes = async (reference_code, likeType) => {
        try {
            await http.post(`/api/video/like/${reference_code}`, {
                like_dislike: likeType,
            });
        } catch (error) {
            console.log(error);
        }
    };
    return { fetchLikes, sendLikes };
}
