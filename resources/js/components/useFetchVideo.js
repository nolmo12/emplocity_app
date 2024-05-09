import axios from "axios";
import { useState, useEffect } from "react";
export default function useFetchVideo({ reference_code }) {
    const [videoObj, setVideoObj] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(
                    `/api/video/watch/${reference_code}`
                );
                setVideoObj(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        };
        fetchVideo();
    }, [reference_code]);

    const getVideoLink = async () => {
        try {
            const response = await axios.get(
                `/api/video/getUrl/${reference_code}`
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    return { videoObj, isLoading, getVideoLink };
}
