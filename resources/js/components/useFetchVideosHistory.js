import axios from "axios";
import authUser from "./authUser";
import { useState, useEffect } from "react";
export default function useFetchVideosHistory() {
    const [videosHistory, setVideosHistory] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { http } = authUser();
    useEffect(() => {
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
        fetchLikedVideos();
        fetchVideosHistory();
    }, []);

    const sendToHistory = async (reference_code) => {
        try {
            await http.post(`/api/history/${reference_code}`);
        } catch (error) {
            console.log(error);
        }
    };

    return { videosHistory, likedVideos, isLoading, sendToHistory };
}
