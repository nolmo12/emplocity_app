import axios from "axios";
import { useState, useEffect } from "react";
export default function useFetchVideosHistory() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchVideos = async (id) => {
            try {
                const response = await axios.get(`api/auth/readUser/${id}`);
                console.log(response.data);
                response.data.videos.map((video) => {
                    setVideos((videos) => [...videos, video]);
                });
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchVideos();
    }, []);
    return { videos, isLoading };
}
