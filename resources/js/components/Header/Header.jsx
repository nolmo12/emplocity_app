import React from "react";
import { useRef, forwardRef, useImperativeHandle } from "react";
import tempLogo from "./tempLogo.png";
import tempIcon from "./ico.png";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./header.module.css";
export default function Header({ onRegisterClick, onLoginClick }) {
    return (
        <>
            <header>
                <img src={tempLogo} alt="Logo"></img>
                <SearchBar />
                <img src={tempIcon} alt="Icon"></img>
            </header>
            <button onClick={onRegisterClick} id={styles.register}>
                Register
            </button>
            <button onClick={onLoginClick} id={styles.login}>
                Login
            </button>
        </>
    );
}
