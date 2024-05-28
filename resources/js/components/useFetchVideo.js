import axios from "axios";
import authUser from "./authUser";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function useFetchVideo({ reference_code }) {
    const [videoObj, setVideoObj] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { http } = authUser();
    const { baseUrl } = config();

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

    const downloadVideo = async () => {
        console.log(reference_code);
        try {
            const response = await http.get(
                `/api/video/download/${reference_code}`
            );
            if (response.status === 200)
                window.open(`${baseUrl}/api/video/download/${reference_code}`);
        } catch (error) {
            console.log(error);
        }
    };
    return { videoObj, isLoading, getVideoLink, downloadVideo };
}
