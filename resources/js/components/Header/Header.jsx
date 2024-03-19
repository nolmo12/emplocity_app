import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import authUser from "../authUser";
import fetchImgFromStorage from "../fetchImgFromStorage";
import tempIcon from "./ico.png";
import tempLogo from "./tempLogo.png";
import iconLogin from "./iconLogin.png";
import iconRegister from "./iconRegister.png";
import styles from "./header.module.css";

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const { getToken, logout, isLogged } = authUser();
    const { fetchImage } = fetchImgFromStorage();

    const toggleMenu = () => {
        if (!isLogged) {
            setShowMenu(!showMenu);
        }
    };

    const loginElement = (
        <Link to="/login">
            <button id={styles.login}>
                <img src={iconLogin}></img>Login
            </button>
        </Link>
    );

    const logoutElement = (
        <li>
            <button onClick={logout} id={styles.login}>
                Logout
            </button>
        </li>
        // styles from styles.logout Logout
    );

    const registerElement = (
        <li>
            <Link to="/register">
                <button id={styles.register}>
                    <img src={iconRegister}></img>Register
                </button>
            </Link>
        </li>
    );

    return (
        <>
            <header>
                <img src={tempLogo} alt="Logo" id={styles.imgLogo}></img>
                <SearchBar />
                <img
                    src={tempIcon}
                    alt="Icon"
                    id={styles.imgIcon}
                    onClick={toggleMenu}
                ></img>
            </header>
            {showMenu && (
                <ul id={styles.menu}>
                    {!isLogged && registerElement}
                    {isLogged ? logoutElement : loginElement}
                </ul>
            )}
        </>
    );
}
