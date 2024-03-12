import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
export default function AuthUser() {
    const [token, setToken] = useState();

    const saveToken = (tempToken, time) => {
        const date = new Date();
        date.setTime(date.getTime() + time * 100000);
        Cookies.set("token", tempToken, {
            path: "/",
            expires: date,
        });
        setToken(tempToken);
    };

    const logout = () => {
        Cookies.remove("token");
        setToken(null);
    };

    const getToken = () => {
        const token = Cookies.get("token");
        return token;
    };

    const refreshToken = () => {
        const token = Cookies.get("token");
        if (token) {
            setToken(token);
        }
    };

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000",
        headers: {
            "Content-type": "application/json",
        },
    });

    return {
        setToken: saveToken,
        logout,
        getToken,
        token,
        http,
    };
}
