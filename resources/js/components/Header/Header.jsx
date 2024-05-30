import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import authUser from "../authUser";
import fetchImgFromStorage from "../fetchImgFromStorage";
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
    faInfoCircle,
    faGavel,
} from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [userAvatar, setUserAvatar] = useState("");
    const [userBorder, setUserBorder] = useState("");
    const [isFetched, setIsFetched] = useState({
        avatar: false,
        border: false,
        tempLogo: false,
    });
    const [isLoaded, setIsLoaded] = useState({
        avatar: false,
        tempLogo: false,
    });
    const userId = useRef("");
    const [path, setPath] = useState(null);
    const [renderKey, setRenderKey] = useState(0);
    const [tempLogoPath, setTempLogoPath] = useState("");
    const { logout, isLogged, getUser } = authUser();
    const { fetchImage, fetchAvatar } = fetchImgFromStorage();

    useEffect(() => {
        fetchData();
    }, [renderKey, showMenu]); // isLogged

    const fetchData = async () => {
        if (isLogged()) {
            setTimeout(async () => {
                const user = await getUser();
                console.log(user);
                userId.current = user.id;
                setUserAvatar(user.avatar);
                setIsFetched((prev) => ({ ...prev, avatar: true }));
                if (user.current_border) {
                    setUserBorder(user.current_border.type);
                    setIsFetched((prev) => ({ ...prev, border: true }));
                }
            }, 1000);

            // security timeout useless
        } else {
            const avatar = await fetchAvatar("ico.png");
            setUserAvatar(avatar);
            setUserBorder(null);
            setIsFetched((prev) => ({ ...prev, avatar: true }));
        }
        const tempLogoPath = await fetchImage("tempLogo.png");
        if (tempLogoPath) {
            setTempLogoPath(tempLogoPath);
            setIsFetched((prev) => ({ ...prev, tempLogo: true }));
        }

        if (userAvatar) {
            setPath(`/history/${userId.current}`);
        }
    };

    const handleLogout = () => {
        logout();
        setRenderKey((prev) => prev + 1);
    };

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
            <button onClick={() => handleLogout()} id={styles.logout}>
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
            <Link to={isLogged() ? "/account" : "/login"}>
                <button id={styles.account}>
                    <FontAwesomeIcon icon={faUser} className={styles.imgMenu} />
                    Account
                </button>
            </Link>
        </li>
    );

    const historyElement = (
        <li onClick={toggleMenu}>
            <Link to={isLogged() ? path : "/login"}>
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

    const aboutUsElement = (
        <li onClick={toggleMenu}>
            <Link to="/about-us">
                <button id={styles.aboutUs}>
                    <FontAwesomeIcon
                        icon={faInfoCircle}
                        className={styles.imgMenu}
                    />
                    About us
                </button>
            </Link>
        </li>
    );

    const rulesElement = (
        <li onClick={toggleMenu}>
            <Link to="/rules">
                <button id={styles.rules}>
                    <FontAwesomeIcon
                        icon={faGavel}
                        className={styles.imgMenu}
                    />
                    Rules
                </button>
            </Link>
        </li>
    );

    return (
        <>
            <header>
                <Link to="/home">
                    {isFetched.tempLogo ? (
                        <img
                            src={tempLogoPath}
                            alt="Logo"
                            data-testid="tempLogo"
                            onLoad={() => {
                                setIsLoaded((prev) => ({
                                    ...prev,
                                    tempLogo: true,
                                }));
                            }}
                            id={styles.imgLogo}
                        ></img>
                    ) : (
                        <ClipLoader color="#000" />
                    )}
                </Link>

                <SearchBar />

                {isFetched.avatar ? (
                    <img
                        src={userAvatar}
                        alt="Icon"
                        data-testid="icon"
                        id={styles.imgIcon}
                        onLoad={() => {
                            setIsLoaded((prev) => ({ ...prev, avatar: true }));
                        }}
                        onClick={toggleMenu}
                    ></img>
                ) : (
                    <ClipLoader color="#000" />
                )}
                {userBorder && <img src={userBorder}></img>}
            </header>
            <ul
                id={styles.menu}
                data-testid="ulMenu"
                className={showMenu ? styles.menuVisible : ""}
            >
                {!isLogged() && registerElement}
                {isLogged() ? logoutElement : loginElement}
                {uploadElement}
                {accountElement}
                {historyElement}
                {helpElement}
                {aboutUsElement}
                {rulesElement}
            </ul>
        </>
    );
}
