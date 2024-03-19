import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Message from "../Message/Message";
import authUser from "../authUser";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";

export default function Register() {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
        repeatPassword: "",
    });
    const navigate = useNavigate();
    const [emailVerfication, setEmailVerfication] = useState(false);
    const { http } = authUser();

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
            setEmailVerfication(true);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <main>
            {emailVerfication ? (
                <Message message="Email verification sent" />
            ) : (
                <form data-testid="form" onSubmit={(e) => handleSubmit(e)}>
                    <Link to="/">
                        <img src={tempIcon} data-testid="logo" alt="Icon"></img>
                    </Link>

                    <input
                        id={styles.Email}
                        type="text"
                        placeholder="Email"
                        value={registeredData.email}
                        onChange={(e) => handleInuptEmail(e)}
                    ></input>
                    <input
                        id={styles.Password}
                        type="password"
                        placeholder="Password"
                        value={registeredData.password}
                        onChange={(e) => handleInputPassword(e)}
                    ></input>

                    <input
                        id={styles.RepeatPassword}
                        type="password"
                        placeholder="Repeat password"
                        value={registeredData.repeatPassword}
                        onChange={(e) => handleInputRepeatPassword(e)}
                    ></input>

                    <button>Register</button>

                    <Link to="/login">I already have an account</Link>
                </form>
            )}
        </main>
    );
}
