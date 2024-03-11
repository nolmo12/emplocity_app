<<<<<<< Updated upstream
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function AuthUser() {
    const navigate = useNavigate();
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    const getToken = () => {
        const tempToken = sessionStorage.getItem("token");
        const userToken = JSON.parse(tempToken);
        return userToken;
    };

    const getUser = () => {
        const tempUser = sessionStorage.getItem("user");
        const userInfo = JSON.parse(tempUser);
        return userInfo;
    };

    const saveToken = (token, user) => {
        sessionStorage.setItem("token", JSON.stringify(token));
        sessionStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);
        navigate("/logged");
    };
    const http = axios.create({
        baseURL: "http://localhost:8000",
        headers: {
            "Content-type": "application/json",
        },
    });
    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        getUser,
        http,
    };
=======
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AuthUser() {
    // TUTAJ
>>>>>>> Stashed changes
}
