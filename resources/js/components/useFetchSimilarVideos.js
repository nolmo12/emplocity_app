import axios from "axios";
import { useState, useEffect } from "react";
import authUser from "./authUser";
export default function useFetchSimilarVideos({ reference_code }) {
    const [videos, setVideos] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { isLogged } = authUser();

    useEffect(() => {
        if (!reference_code) return;
        const fetchVideos = async () => {
            try {
                const response = await axios.get(
                    `/api/video/similarVideos/${reference_code}`
                );
                console.log(response.data);
                setVideos(response.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchVideos();
    }, [reference_code]);
    return { videos, isLoading };
}
