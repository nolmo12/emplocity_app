import axios from "axios";
import AuthUser from "./AuthUser";
export default function jwtRefresh() {
    const { setToken, getToken } = AuthUser();
    const http = axios.create({
        baseURL: "http://127.0.0.1:8000",
        headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + getToken(),
        },
    });
    const refreshToken = async () => {
        try {
            const response = await http.post("/api/auth/refresh");
            setToken(response.data.authorisation.token, 5000); // time from api
            return response.data;
        } catch (e) {
            console.log(e);
        }
    };

    return { httpAuth: http, refreshToken };
}
