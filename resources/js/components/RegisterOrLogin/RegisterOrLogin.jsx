import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import mailIcon from "./mailIcon.png";
import lockIcon from "./lockIcon.png";
import styles from "./registerOrLogin.module.css";
// import AuthProvider, { AuthContext } from "../AuthProvider";
export default function RegisterOrLogin({ componentType }) {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
    });
    const [tempFlag, setTempFlag] = useState(false);
    // const { isLogged, setIsLogged } = useContext(AuthContext);
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
            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/register",
                registeredData
            );
        } catch (er) {
            console.log("Error polski", er);
        }
    };

    //Function to check user is Logged in
    function chcekIsLogged() {
        if (tempFlag) {
            if (!localStorage.getItem("user")) {
                const user = {
                    email: registeredData.email,
                    password: registeredData.password,
                };
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                const user = JSON.parse(localStorage.getItem("user"));
                if (
                    user.email === registeredData.email &&
                    user.password === registeredData.password &&
                    componentType === "login"
                ) {
                    console.log("LOGGED IN");
                    // setIsLogged(true);
                }
            }
        }
    }

    return (
        <main>
            <form data-testid="form" onSubmit={handleSubmit}>
                <Link to="/">
                    <img src={tempIcon} alt="Icon"></img>

                {isRegister && <button>Register</button>}
                {isLogin && <button>Login</button>}
                {isRegister && (
                    <Link to="/login">
                        <a data-testid="fromRegisterToLogin">
                            I already have an account
                        </a>
                    </Link>
                )}
                {isLogin && (
                    <Link to="/register">
                        <a data-testid="fromLoginToRegister">Create account</a>
                    </Link>
                )}
            </form>
        </main>
    );
}
