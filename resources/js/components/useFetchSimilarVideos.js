import axios from "axios";
import { useState, useEffect } from "react";
export default function useFetchSimilarVideos({ referenceCode }) {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(
                    `/api/video/similarVideos/${referenceCode}`
                );
                response.data.map((video) => {
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
