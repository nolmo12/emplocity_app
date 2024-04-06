import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import authUser from "../authUser";
import fetchImage from "../fetchImgFromStorage";
import styles from "./header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faSignInAlt,
    faUpload,
    faUser,
    faHistory,
    faQuestionCircle,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const [tempLogoPath, setTempLogoPath] = useState("");
    const { getToken, logout, isLogged } = authUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [iconPath, tempLogoPath] = await Promise.all([
                    fetchImage("ico.png"),
                    fetchImage("tempLogo.png"),
                ]);
                setIconPath(iconPath);
                setTempLogoPath(tempLogoPath);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const loginElement = (
        <Link to="/login">
            <button id={styles.login} onClick={toggleMenu}>
                <FontAwesomeIcon
                    icon={faSignInAlt}
                    className={styles.imgMenu}
                />
                Login
            </button>
        </Link>
    );

    const logoutElement = (
        <li onClick={toggleMenu}>
            <button onClick={logout} id={styles.logout}>
                <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className={styles.imgMenu}
                />
                Logout
            </button>
        </li>
        // styles from styles.logout Logout
    );

    const registerElement = (
        <li onClick={toggleMenu}>
            <Link to="/register">
                <button id={styles.register}>
                    <FontAwesomeIcon
                        icon={faUserPlus}
                        className={styles.imgMenu}
                    />
                    Register
                </button>
            </Link>
        </li>
    );

    const uploadElement = (
        <li onClick={toggleMenu}>
            <Link to="/upload">
                <button id={styles.upload}>
                    <FontAwesomeIcon
                        icon={faUpload}
                        className={styles.imgMenu}
                    />
                    Upload
                </button>
            </Link>
        </li>
    );

    const accountElement = (
        <li onClick={toggleMenu}>
            <Link to="/account">
                <button id={styles.account}>
                    <FontAwesomeIcon icon={faUser} className={styles.imgMenu} />
                    Account
                </button>
            </Link>
        </li>
    );

    const historyElement = (
        <li onClick={toggleMenu}>
            <Link to="/">
                <button id={styles.history}>
                    <FontAwesomeIcon
                        icon={faHistory}
                        className={styles.imgMenu}
                    />
                    History
                </button>
            </Link>
        </li>
    );

    const helpElement = (
        <li onClick={toggleMenu}>
            <Link to="/help">
                <button id={styles.help}>
                    <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className={styles.imgMenu}
                    />
                    Help
                </button>
            </Link>
        </li>
    );

    return (
        <>
            <header>
                {tempLogoPath ? (
                    <Link to="/">
                        <img
                            src={tempLogoPath}
                            alt="Logo"
                            data-testid="tempLogo"
                            id={styles.imgLogo}
                        ></img>
                    </Link>
                ) : (
                    <ClipLoader color="#000" />
                )}
                <SearchBar />
                {iconPath ? (
                    <img
                        src={iconPath}
                        alt="Icon"
                        data-testid="icon"
                        id={styles.imgIcon}
                        onClick={toggleMenu}
                    ></img>
                ) : (
                    <ClipLoader color="#000" />
                )}
            </header>
            <ul
                id={styles.menu}
                data-testid="ulMenu"
                className={showMenu ? styles.menuVisible : ""}
            >
                {!isLogged && registerElement}
                {isLogged ? logoutElement : loginElement}
                {uploadElement}
                {accountElement}
                {historyElement}
                {helpElement}
            </ul>
        </>
    );
}
