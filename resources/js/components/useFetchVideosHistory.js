import axios from "axios";
import authUser from "./authUser";
import { useState, useEffect } from "react";
export default function useFetchVideosHistory() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { http } = authUser();
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await http.get(`/api/auth/likedVideos`);
                console.log(response.data);
                setVideos(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchVideos();
    }, []);
    return { videos, isLoading };
}
