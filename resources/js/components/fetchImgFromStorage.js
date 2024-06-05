import axios from "axios";
import authUser from "./authUser";
export default function fetchImgFromStorage() {
    const { setError } = authUser();
    const fetchImage = async (path) => {
        try {
            const response = await axios.get(`/api/storage/image/${path}`);
            return response.data[0];
        } catch (error) {
            setError(error);
            return null;
        }
    };

    const fetchAvatar = async (path) => {
        try {
            const response = await axios.get(`/api/storage/avatars/${path}`);
            return response.data[0];
        } catch (error) {
            setError(error);
            return null;
        }
    };

    return { fetchImage, fetchAvatar };
}
