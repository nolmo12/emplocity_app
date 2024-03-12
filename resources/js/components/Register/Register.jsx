import React, { useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";
import AuthUser from "../AuthUser";
export default function Register() {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });

    const { http } = AuthUser();

    function handleInuptEmail(e) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/register",
                {
                    email: registeredData.email,
                    password: registeredData.password,
                    repeatPassword: registeredData.repeatPassword,
                }
            );
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <main>
            <form data-testid="form" onSubmit={(e) => handleSubmit(e)}>
                <Link to="/">
                    <img src={tempIcon} data-testid="logo" alt="Icon"></img>
                </Link>

                <input
                    type="text"
                    placeholder="Email"
                    value={registeredData.email}
                    onChange={(e) => handleInuptEmail(e)}
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    value={registeredData.password}
                    onChange={(e) => handleInputPassword(e)}
                ></input>

                <input
                    type="password"
                    placeholder="Repeat password"
                    value={registeredData.repeatPassword}
                    onChange={(e) => handleInputRepeatPassword(e)}
                ></input>

                <button>Register</button>

                <Link to="/login">I already have an account</Link>
            </form>
        </main>
    );
}
