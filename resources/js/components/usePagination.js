import { useState } from "react";
import axios from "axios";
import authUser from "./authUser";
export default function usePagination({ videos }) {
    const { setError } = authUser();
    const [videos, setVideos] = useState(videos);
    const fetchNextVideos = async (offset) => {
        try {
            const response = await axios.get(
                `/api/video/listing?offset=${offset}`
            );
            setVideos([...videos, ...response.data]);
        } catch (error) {
            setError(error);
        }
    };
    return { fetchNextVideos };
}
