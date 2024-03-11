<<<<<<< Updated upstream
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";
=======
import React from "react";
import { useState } from "react";
import AuthUser from "./AuthUser";
>>>>>>> Stashed changes
export default function Register() {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });

<<<<<<< Updated upstream
=======
    const { http } = axios();

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/register", registeredData);
        } catch (e) {
            console.log(e);
=======
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            http.post("/api/register", registeredData);
        } catch (er) {
            console.log(er);
>>>>>>> Stashed changes
        }
    };

    return (
        <main>
<<<<<<< Updated upstream
            <form data-testid="form" onSubmit={handleSubmit}>
=======
            <form onSubmit={(e) => handleSubmit(e)}>
>>>>>>> Stashed changes
                <Link to="/">
                    <img src={tempIcon} alt="Icon"></img>
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

<<<<<<< Updated upstream
                <Link to="/login" data-testid="fromRegisterToLogin">
                    I already have an account
                </Link>
=======
                <Link to="/login">I already have an account</Link>
>>>>>>> Stashed changes
            </form>
        </main>
    );
}
