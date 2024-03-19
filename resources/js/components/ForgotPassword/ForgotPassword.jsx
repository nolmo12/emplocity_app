import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tempIcon from "./ico.png";
import styles from "./forgotPassword.module.css";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    function handleInputEmail(e) {
        setEmail(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault(); // wait for backend
        if (isValid) {
            setMessage(
                "Email will be sent, you will be redirected to the login page"
            );
            setInterval(() => {
                navigate("/login");
            }, 4000);
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <Link to="/">
                    <img src={tempIcon} alt="Icon"></img>
                </Link>
                <input
                    type="text"
                    onChange={(e) => handleInputEmail(e)}
                    placeholder="Email"
                ></input>
                {message && <p>{message}</p>}
                <button>Send</button>
            </form>
        </main>
    );
}
