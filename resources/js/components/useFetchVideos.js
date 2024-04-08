import axios from "axios";
import authUser from "./authUser";
import { useEffect } from "react";
export default function useFetchVideos() {
    const [videos, setVideos] = useState([]);

    const fetchVideos = async () => {
        try {
            const response = await axios.get("/api/storage/videos");
            response.data.map((video) => {
                setVideos((videos) => [...videos, video]);
            });
        } catch (error) {
            console.log(error);
        }
    };
    fetchVideos();
    return videos;
}
