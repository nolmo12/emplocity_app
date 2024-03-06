import React from "react";
import tempLogo from "./tempLogo.png";
import { Link } from "react-router-dom";
import tempIcon from "./ico.png";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./header.module.css";
export default function Header() {
    return (
        <>
            <header>
                <img src={tempLogo} alt="Logo"></img>
                <SearchBar />
                <img src={tempIcon} alt="Icon"></img>
            </header>
            <Link to="/register">
                <button id={styles.register}>Register</button>
            </Link>

            <Link to="/login">
                <button id={styles.login}>Login</button>
            </Link>
        </>
    );
}
