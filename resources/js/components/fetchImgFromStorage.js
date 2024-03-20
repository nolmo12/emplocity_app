import axios from "axios";
export default async function fetchImage(path) {
    try {
        const response = await axios.get(`/api/storage/image/${path}`);
        return response.data[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}
