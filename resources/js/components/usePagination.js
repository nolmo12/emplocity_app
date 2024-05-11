import { useState } from "react";
import authUser from "./authUser";
export default function usePagination({ videos }) {
    const { http } = authUser();
    const [videos, setVideos] = useState(videos);
    const fetchNextVideos = async (offset) => {
        try {
            const response = await http.get(
                `/api/video/listing?offset=${offset}`
            );
            setVideos([...videos, ...response.data]);
        } catch (error) {
            console.log(error);
        }
    };
    return { fetchNextVideos };
}
