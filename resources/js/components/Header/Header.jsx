import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import authUser from "../authUser";
import fetchImage from "../fetchImgFromStorage";
import styles from "./header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt, faUpload, faUser, faHistory, faQuestionCircle  } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const [tempLogoPath, setTempLogoPath] = useState("");
    const { getToken, logout, isLogged } = authUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    iconPath,
                    tempLogoPath,
                ] = await Promise.all([
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
        if (!isLogged) {
            setShowMenu(!showMenu);
        }
    };

    const loginElement = (
        <Link to="/login">
            <button id={styles.login}>
                <FontAwesomeIcon icon={faSignInAlt} className={styles.imgMenu}/>
                Login
            </button>
        </Link>
    );

    const logoutElement = (
        <li>
            <button onClick={logout} id={styles.login} >
                Logout
            </button>
        </li>
        // styles from styles.logout Logout
    );

    const registerElement = (
        <li>
            <Link to="/register">
                <button id={styles.register}>
                    <FontAwesomeIcon icon={faUserPlus} className={styles.imgMenu}/>
                    Register
                </button>
            </Link>
        </li>
    );

    const uploadElement = (
        <li>
            <Link to="/">
                <button id={styles.upload}>
                    <FontAwesomeIcon icon={faUpload} className={styles.imgMenu}/>
                    Upload
                </button>
            </Link>
        </li>
    );

    const accountElement = (
        <li>
            <Link to="/">
                <button id={styles.account}>
                    <FontAwesomeIcon icon={faUser} className={styles.imgMenu}/>
                    Account
                </button>
            </Link>
        </li>
    );

    const historyElement = (
        <li>
            <Link to="/">
                <button id={styles.history}>
                    <FontAwesomeIcon icon={faHistory} className={styles.imgMenu}/>
                    History
                </button>
            </Link>
        </li>
    );

    const helpElement = (
        <li>
            <Link to="/">
                <button id={styles.help}>
                    <FontAwesomeIcon icon={faQuestionCircle} className={styles.imgMenu}/>
                    Help
                </button>
            </Link>
        </li>
    );

    return (
        <>
            <header>
            {tempLogoPath ? (
                    <img
                        src={tempLogoPath}
                        alt="Logo"
                        data-testid="tempLogo"
                        id={styles.imgLogo}
                    ></img>
                ) : (
                    <p data-testid="loadingTempLogoPath"></p>
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
                    <p data-testid="loadingIconPath"></p>
                )}
            </header>
                <ul id={styles.menu} data-testid="ulMenu" className={showMenu ? styles.menuVisible : ''}>
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
