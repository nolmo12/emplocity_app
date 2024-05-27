import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function useAuth() {
    const navigate = useNavigate();
    const { baseUrl } = config();

    const getToken = () => {
        return Cookies.get("token");
    };

    const getRefreshToken = () => {
        return Cookies.get("refresh_token");
    };

    const [token, setToken] = useState(getToken());
    const [refreshToken, setRefreshToken] = useState(getRefreshToken());

    const http = axios.create({
        baseURL: baseUrl,
    });

    http.interceptors.request.use((config) => {
        const token = getToken();
        console.log("Token:", token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const saveToken = (tempToken) => {
        const fourMin = 1000 * 60 * 4;
        const date = new Date();
        date.setTime(date.getTime() + fourMin);
        setToken(tempToken);
        Cookies.set("token", tempToken, { expires: date });
    };

    const saveRefreshToken = (refreshToken) => {
        setRefreshToken(refreshToken);
        Cookies.set("refresh_token", refreshToken);
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("refresh_token");
        setToken(null);
        setRefreshToken(null);
        navigate("/");
    };

    const refreshJWT = async () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            try {
                console.log("Refreshing token...");
                const res = await http.post("/api/auth/refresh", null, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });
                console.log("Token refreshed successfully:", res.data);
                saveToken(res.data.authorisation.token);
            } catch (error) {
                console.error("Error refreshing token:", error);
                // Consider logging out the user on token refresh failure
            }
        } else {
            console.log("No refresh token available.");
            // Consider logging out the user if no refresh token is available
        }
    };

    const isLogged = () => {
        if (token) {
            console.log("logged");
            return true;
        } else if (refreshToken) {
            console.log("refreshing token...");
            refreshJWT();
            return true;
        }
        console.log("not logged");
        return false;
    };

    // useEffect(() => {
    //     if (!token && refreshToken) {
    //         refreshJWT();
    //     }
    // }, [token, refreshToken]);

    return {
        setToken: saveToken,
        setRefreshToken: saveRefreshToken,
        refreshJWT,
        logout,
        getToken,
        http,
        isLogged,
    };
}
