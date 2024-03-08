import React, { useState } from "react";
import { useEffect } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import tempIcon from "./ico.png";
import mailIcon from "./mailIcon.png";
import lockIcon from "./lockIcon.png";
import styles from "./registerOrLogin.module.css";
import useAuthContext from "../AuthContext";

export default function RegisterOrLogin({ componentType }) {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });

    const navigate = useNavigate();
    const { login, register, user, logout } = useAuthContext();

    useEffect(() => {
        if (user) {
            // If the user is available, you can perform actions here
            console.log("User:", user);
        }
    }, [user]);

    function handleInputEmail(e) {
        setRegisteredData({ ...registeredData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setRegisteredData({ ...registeredData, password: e.target.value });
    }

    function handleInputRepeatPassword(e) {
        setRegisteredData({
            ...registeredData,
            repeatPassword: e.target.value,
        });
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        let url;
        if (type === "login") {
            url = "http://127.0.0.1:8000/api/auth/login";
            navigate("/logged");
        } else if (type === "register") {
            url = "http://127.0.0.1:8000/api/auth/register";
        } else {
            throw new Error(`Invalid type: ${type}`);
        }
        await handleFetchApi(e, url);
    };

    const handleFetchApi = async (e, url) => {
        e.preventDefault();
        if (url === "http://127.0.0.1:8000/api/auth/login") {
            login(registeredData.email, registeredData.password);
        } else if (url === "http://127.0.0.1:8000/api/auth/register") {
            register(
                registeredData.email,
                registeredData.password,
                registeredData.repeatPassword
            );
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/api/auth/logout");
            logout(); // Call the logout function from the auth context
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <main>
            <form onSubmit={(e) => handleSubmit(e, componentType)}>
                <Link to="/">
                    <img src={tempIcon} alt="Icon" />
                </Link>
                <input
                    type="text"
                    placeholder="Email"
                    value={registeredData.email}
                    onChange={handleInputEmail}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={registeredData.password}
                    onChange={handleInputPassword}
                />
                {componentType === "register" && (
                    <input
                        type="password"
                        placeholder="Repeat password"
                        value={registeredData.repeatPassword}
                        onChange={handleInputRepeatPassword}
                    />
                )}
                {componentType === "login" && (
                    <Link to="/forgotPassword">
                        <a>Forgot password?</a>
                    </Link>
                )}

                {componentType === "register" ? (
                    <button>Register</button>
                ) : (
                    <button>Login</button>
                )}
                {componentType === "register" ? (
                    <Link to="/login">I already have an account</Link>
                ) : (
                    <Link to="/register">Create account</Link>
                )}
            </form>
            <form onSubmit={handleLogout}>
                <button id={styles.register}>Logout</button>
            </form>
        </main>
    );
}
