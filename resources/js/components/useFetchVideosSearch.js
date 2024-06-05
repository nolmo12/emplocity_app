import axios from "axios";
import authUser from "./authUser";
import { useState, useEffect } from "react";
export default function useFetchVideosSearch() {
    const [isLoading, setIsLoading] = useState(true);
    const { http, isLogged, setError } = authUser();

    const fetchVideosHistory = async () => {
        try {
            const response = await http.get(`/api/history/read`);
            setIsLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
        }
    };
    const fetchLikedVideos = async () => {
        try {
            const response = await http.get(`/api/auth/likedVideos`);
            setIsLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
        }
    };

    const fetchSearchedVideos = async (query, offest, sortingType) => {
        try {
            const response = await http.get(
                `/api/video/search/?query=${query}&page=${offest}&sorting=${sortingType}&is_typing_in_search_input=0`
            );
            setIsLoading(false);
            return response.data;
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        if (!isLogged()) return;
        // fetchLikedVideos();
        // fetchVideosHistory();
    }, []);

    const sendToHistory = async (reference_code) => {
        if (!isLogged()) return;
        try {
            await http.post(`/api/history/${reference_code}`);
        } catch (error) {
            setError(error);
        }
    };

    return {
        fetchSearchedVideos,
        fetchLikedVideos,
        fetchVideosHistory,
        isLoading,
        setIsLoading,
        sendToHistory,
    };
}
