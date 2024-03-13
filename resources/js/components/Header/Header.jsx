import React from "react";
import { useState, useRef } from "react";
import tempLogo from "./tempLogo.png";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./header.module.css";
import authUser from "../authUser";

export default function Header() {
    const { getToken, logout } = authUser();
    const [showMenu, setShowMenu] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    if (getToken() && isLogged === false) {
        setIsLogged(true);
    }
    if (!getToken() && isLogged === true) {
        setIsLogged(false);
    }

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const loginElement = (
        <Link to="/login">
            <button id={styles.login}>Login</button>
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
                <button id={styles.register}>Register</button>
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
