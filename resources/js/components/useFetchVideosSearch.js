import axios from "axios";
import authUser from "./authUser";
import { useState, useEffect } from "react";
export default function useFetchVideosSearch() {
    const [videosHistory, setVideosHistory] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [searchedVideos, setSearchedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { http, isLogged } = authUser();

    const fetchVideosHistory = async () => {
        try {
            const response = await http.get(`/api/history/read`);
            setVideosHistory(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchLikedVideos = async () => {
        try {
            const response = await http.get(`/api/auth/likedVideos`);
            setLikedVideos(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSearchedVideos = async (query, offest, sortingType) => {
        try {
            const response = await http.get(
                `/api/video/search/?query=${query}&offest=${offest}&sorting=${sortingType}`
            );
            setIsLoading(false);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!isLogged) return;
        fetchLikedVideos();
        fetchVideosHistory();
    }, []);

    const sendToHistory = async (reference_code) => {
        if (!isLogged) return;
        try {
            await http.post(`/api/history/${reference_code}`);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        videosHistory,
        likedVideos,
        fetchSearchedVideos,
        isLoading,
        sendToHistory,
    };
}
