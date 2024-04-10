import axios from "axios";
import { useState, useEffect } from "react";
export default function useFetchSimilarVideos({ reference_code }) {
    const [videos, setVideos] = useState();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(
                    `/api/video/similarVideos/${reference_code}`
                );
                setVideos(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchVideos();
    }, [reference_code]);
    return { videos, isLoading };
}
