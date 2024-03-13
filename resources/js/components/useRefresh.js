import axios from "axios";
import AuthUser from "./AuthUser";
export default function useRefresh() {
    const { setToken } = AuthUser();

    const refresh = async () => {
        const response = await axios.post("/api/auth/refresh", {
            withCredentials: true,
        });
        setToken((prev) => {
            console.log(JSON.stringify(response.data));
            console.log(response.data.token);
            return { ...prev, token: response.data.token };
        });
        return response.data.token;
    };
    return refresh;
}
