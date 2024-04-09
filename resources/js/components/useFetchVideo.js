import axios from "axios";
import { useState, useEffect } from "react";
export default function useFetchVideo({ reference_code }) {
    const [videoObj, setVideoObj] = useState({});
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(
                    `/api/video/watch/${reference_code}`
                );
                setVideoObj(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchVideo();
    }, []);
    return videoObj;
}
