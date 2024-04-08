import axios from "axios";
import { useState, useEffect } from "react";
export default function useFetchVideo({ reference_code }) {
    const [videoObj, setVideoObj] = useState({});
    useEffect(() => {
        console.log(1);
        const fetchVideo = async () => {
            console.log(reference_code);
            try {
                const response = await axios.get(
                    `/api/video/watch/${reference_code}`
                );
                console.log(response.data);
                setVideoObj(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchVideo();
    }, []);
    return videoObj;
}
