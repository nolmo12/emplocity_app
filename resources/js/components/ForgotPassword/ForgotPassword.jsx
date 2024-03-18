import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Message from "../Message/Message";
import tempIcon from "./ico.png";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();

    function handleInputEmail(e) {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // wait for backend
        setIsSent(true);
    };

    return (
        <main>
            {isSent ? (
                <Message message="Email sent" />
            ) : (
                <form onSubmit={handleSubmit}>
                    <Link to="/">
                        <img src={tempIcon} alt="Icon"></img>
                    </Link>
                    <input
                        type="text"
                        onChange={(e) => handleInputEmail(e)}
                        placeholder="Email"
                    ></input>
                    <button>Send</button>
                </form>
            )}
        </main>
    );
}
