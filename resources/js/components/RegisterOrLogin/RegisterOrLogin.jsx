import React from "react";
import { useState } from "react";
import tempIcon from "./ico.png";
import styles from "./registerOrLogin.module.css";
export default function RegisterOrLogin({ componentType }) {
    const [registeredData, setRegisteredData] = useState({
        email: "",
        password: "",
    });

    function handleInuptEmail(e) {
        setRegisteredData({ ...registeredData, email: e.target.value });
    }

    function handleInputPassword(e) {
        setRegisteredData({ ...registeredData, password: e.target.value });
    }

    const isRegister = componentType === "register";
    const isLogin = componentType === "login";

    return (
        <>
            <main>
                <form>
                    <img src={tempIcon} alt="Icon"></img>
                    <input
                        type="text"
                        placeholder="Email"
                        value={registeredData.email}
                        onChange={(e) => handleInuptEmail(e)}
                    ></input>
                    {isLogin && <a href="example.com">Forgot email?</a>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={registeredData.password}
                        onChange={(e) => handleInputPassword(e)}
                    ></input>
                    {isLogin && <a href="example.com">Forgot password?</a>}

                    {isRegister && <button>Register</button>}
                    {isLogin && <button>Login</button>}
                    {isRegister && (
                        <a href="example.com">I already have an account</a>
                    )}
                    {isLogin && <a href="example1.com">Create account</a>}
                </form>
            </main>
        </>
    );
}
