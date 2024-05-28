import axios from "axios";
import authUser from "./authUser";
import { useState, useEffect } from "react";

export default function useFetchVideo({ reference_code }) {
    const [videoObj, setVideoObj] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { http } = authUser();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await http.get(
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
            const response = await http.get(
                `/api/video/getUrl/${reference_code}`
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    return { videoObj, isLoading, getVideoLink };
}
