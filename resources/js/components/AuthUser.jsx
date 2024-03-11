import { useState } from "react";
import axios from "axios";
export default function AuthUser() {
    const [token, setToken] = useState();

    const saveToken = (tempToken) => {
        localStorage.setItem("token", tempToken);
        setToken(tempToken);
    };

    const getToken = () => {
        const token = localStorage.getItem("token");
        return token;
    };

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return {
        setToken: saveToken,
        token,
        http,
        token,
        getToken,
    };
}
