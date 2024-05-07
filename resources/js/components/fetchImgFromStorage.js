import axios from "axios";
export default async function fetchImgFromStorage() {
    const fetchImage = async (path) => {
        try {
            const response = await axios.get(`/api/storage/image/${path}`);
            return response.data[0];
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const fetchAwatar = async (path) => {
        try {
            const response = await axios.get(`/api/storage/avatars/${path}`);
            return response.data[0];
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return { fetchImage, fetchAwatar };
}
