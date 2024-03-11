import React, { useContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";
export default function Register() {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });

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

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/register", registeredData);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <main>
            <form data-testid="form" onSubmit={handleSubmit}>
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

                <Link to="/login" data-testid="fromRegisterToLogin">
                    I already have an account
                </Link>
            </form>
        </main>
    );
}
