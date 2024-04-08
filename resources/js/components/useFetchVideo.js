import axios from "axios";
import { useState, useEffect } from "react";
export default function useFetchVideo({ reference_code }) {
    const [video, setVideo] = useState({});
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(
                    `/api/video/watch/${reference_code}`
                );
                setVideo(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchVideo();
    }, []);
    return video;
}
