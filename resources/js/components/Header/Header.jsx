import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import authUser from "../authUser";
import fetchImage from "../fetchImgFromStorage";
import styles from "./header.module.css";

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [iconPath, setIconPath] = useState("");
    const [iconLoginPath, setIconLoginPath] = useState("");
    const [iconRegisterPath, setIconRegisterPath] = useState("");
    const [tempLogoPath, setTempLogoPath] = useState("");
    const { getToken, logout, isLogged } = authUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    iconPath,
                    iconLoginPath,
                    iconRegisterPath,
                    tempLogoPath,
                ] = await Promise.all([
                    fetchImage("ico.png"),
                    fetchImage("iconLogin.png"),
                    fetchImage("iconRegister.png"),
                    fetchImage("tempLogo.png"),
                ]);
                setIconPath(iconPath);
                setIconLoginPath(iconLoginPath);
                setIconRegisterPath(iconRegisterPath);
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
                {iconLoginPath && <img src={iconLoginPath}></img>}
                Login
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
                    {iconRegisterPath && <img src={iconRegisterPath}></img>}
                    Register
                </button>
            </Link>
        </li>
    );

    return (
        <>
            <header>
                {tempLogoPath && (
                    <img
                        src={tempLogoPath}
                        alt="Logo"
                        id={styles.imgLogo}
                    ></img>
                )}
                <SearchBar />
                {iconPath && (
                    <img
                        src={iconPath}
                        alt="Icon"
                        id={styles.imgIcon}
                        onClick={toggleMenu}
                    ></img>
                )}
            </header>
                <ul id={styles.menu} className={showMenu ? styles.menuVisible : ''}>
                    {!isLogged && registerElement}
                    {isLogged ? logoutElement : loginElement}
                </ul>

        </>
    );
}
