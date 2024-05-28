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
    const [imageLoaded, setImageLoaded] = useState({
        avatar: false,
        tempLogo: false,
    });
    const userAvatar = useRef("");
    const userId = useRef("");
    const [path, setPath] = useState(null);
    const [renderKey, setRenderKey] = useState(0);
    const [tempLogoPath, setTempLogoPath] = useState("");
    const [avatarPath, setAvatarPath] = useState("");
    const { logout, isLogged, getUser } = authUser();
    const getUserData = async () => {
        // wait for token update
        await new Promise((resolve) => setTimeout(resolve, 100));
        const user = await getUser();
        userAvatar.current = user.avatar;
        const avatarFileName = userAvatar.current.split("/").pop();
        userAvatar.current = avatarFileName;
        userId.current = user.id;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (isLogged()) {
                await getUserData();
            } //else {
            //     userAvatar.current = "ico.png";
            // }
            const { fetchImage, fetchAvatar } = await fetchImgFromStorage();
            if (userAvatar.current) {
                setPath(`/history/${userId.current}`);
                try {
                    const [avatarPath, tempLogoPath] = await Promise.all([
                        fetchAvatar(userAvatar.current),
                        fetchImage("tempLogo.png"),
                    ]);

                    setTempLogoPath(tempLogoPath);
                    setAvatarPath(avatarPath);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchData();
    }, [renderKey]); // isLogged

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
                {tempLogoPath ? (
                    <>
                        {!imageLoaded.tempLogo && <ClipLoader color="#000" />}
                        <Link to="/home">
                            <img
                                src={tempLogoPath}
                                alt="Logo"
                                data-testid="tempLogo"
                                onLoad={() =>
                                    setImageLoaded((prev) => ({
                                        ...prev,
                                        tempLogo: true,
                                    }))
                                }
                                id={styles.imgLogo}
                            ></img>
                        </Link>
                    </>
                ) : (
                    <ClipLoader color="#000" />
                )}
                <SearchBar />
                {avatarPath ? (
                    <>
                        {!imageLoaded.avatar && <ClipLoader color="#000" />}
                        <img
                            src={avatarPath}
                            alt="Icon"
                            data-testid="icon"
                            id={styles.imgIcon}
                            onLoad={() =>
                                setImageLoaded((prev) => ({
                                    ...prev,
                                    avatar: true,
                                }))
                            }
                            onClick={toggleMenu}
                        ></img>
                    </>
                ) : (
                    <ClipLoader color="#000" />
                )}
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
