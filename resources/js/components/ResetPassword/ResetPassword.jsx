import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const navigate = useNavigate();

    const handleInputPassword = (e) => {
        setPassword(e.target.value);
    };

    const handleInputRepeatPassword = (e) => {
        setRepeatPassword(e.target.value);
    };

    const handleSubmit = async () => {
        // api call to reset password
        navigate("/login");
    };

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    onChange={(e) => handleInputPassword(e)}
                    placeholder="password"
                ></input>
                <input
                    type="password"
                    onChange={(e) => handleInputRepeatPassword(e)}
                    placeholder="repeat password"
                ></input>
                <button type="submit">Reset</button>
            </form>
        </main>
    );
}
