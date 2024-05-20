import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function authUser() {
    const navigate = useNavigate();
    const { baseUrl } = config();

    const getToken = () => {
        const token = Cookies.get("token");
        return token;
    };

    // const [token, setToken] = useState(getToken());

    const http = axios.create({
        baseURL: baseUrl,
        // headers: {
        //     Authorization: `Bearer ${getToken()}`,
        // },
    });

    http.interceptors.request.use((config) => {
        const token = getToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    const getCSRFToken = () => {
        const token = Cookies.get("XSRF-TOKEN");
        return token;
    };

    useEffect(() => {
        http.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${getToken()}`;
            return config;
        });
    }, [getToken()]);

    const saveToken = (tempToken, time) => {
        const date = new Date(); // time from api
        const tempTime = Number(date.getTime() + time);
        date.setTime(tempTime);
        Cookies.set("token", tempToken, {
            expires: date,
        });
    };

    const logout = () => {
        Cookies.remove("token");
        navigate("/");
    };

    // const getJWTToken = async () => {
    //     const tempToken = getToken();
    //     if (!tempToken) {
    //         try {
    //             const response = await http.post("/api/auth/refresh");
    //             console.log(response.data);
    //             saveToken(response.data.authorisation.token, baseTime);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     return tempToken;
    // };

    const isLogged = () => {
        const tempToken = getToken();
        if (tempToken) {
            return true;
        } else {
            return false;
        }
    };

    return {
        setToken: saveToken,
        logout,
        getToken,
        http,
        isLogged,
    };
}
