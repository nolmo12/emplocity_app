import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";
import Main from "../../Main";
export default function RegisterOrLogin({ componentType }) {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const isRegister = componentType === "register";
    const isLogin = componentType === "login";

    function handleInuptEmail(e) {
        setRegisteredData({ ...registeredData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setRegisteredData({ ...registeredData, password: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/sets/store"
            );
            console.log(response.data);
        } catch (er) {
            console.log("Error polski", er);
        }
    };

    function navigateTemp() {
        navigate("/");
    }

    return (
        <>
            <main>
                <form onSubmit={handleSubmit}>
                    <img src={tempIcon} alt="Icon" onClick={navigateTemp}></img>
                    <input
                        type="text"
                        placeholder="Email"
                        value={registeredData.email}
                        onChange={(e) => handleInuptEmail(e)}
                    ></input>
                    {isLogin && <a>Forgot email?</a>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={registeredData.password}
                        onChange={(e) => handleInputPassword(e)}
                    ></input>
                    {isLogin && <a>Forgot password?</a>}

                    {isRegister && <button>Register</button>}
                    {isLogin && <button>Login</button>}
                    {isRegister && (
                        <a onClick={() => navigate("/login")}>
                            I already have an account
                        </a>
                    )}
                    {isLogin && (
                        <a onClick={() => navigate("/register")}>
                            Create account
                        </a>
                    )}
                </form>
            </main>
        </>
    );
}
