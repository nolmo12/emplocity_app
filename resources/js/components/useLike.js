import axios from "axios";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useLike() {
    const { http, setError } = authUser();
    const fetchLikes = async (reference_code) => {
        try {
            const response = await http.get(
                `/api/video/hasUserLiked/${reference_code}`
            );

            return response.data;
        } catch (error) {
            setError(error);
        }
    };
    const sendLikes = async (reference_code, likeType) => {
        try {
            await http.post(`/api/video/like/${reference_code}`, {
                like_dislike: likeType,
            });
        } catch (error) {
            setError(error);
        }
    };
    return { fetchLikes, sendLikes };
}
