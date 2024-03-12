import React from "react";
import tempLogo from "./tempLogo.png";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./header.module.css";
import AuthUser from "../AuthUser";
export default function Header() {
    const { getToken, logout } = AuthUser();
    return (
        <>
            <header>
                <img src={tempLogo} alt="Logo" id={styles.imgLogo}></img>
                <SearchBar />
                <img src={tempIcon} alt="Icon" id={styles.imgIcon}></img>
            </header>
            <Link to="/register">
                <button id={styles.register}>Register</button>
            </Link>

            {!getToken() && (
                <Link to="/login">
                    <button id={styles.login}>Login</button>
                </Link>
            )}
            <button id={styles.logout} onClick={logout}>
                Logout
            </button>
        </>
    );
}
