import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    function handleInputEmail(e) {
        setEmail(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    function test() {
        console.log(email);
    }
    return (
        <main>
            <form onSubmit={test}>
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
        </main>
    );
}
