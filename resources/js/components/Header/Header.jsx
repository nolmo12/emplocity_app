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
    const userAwatar = useRef("");
    const userId = useRef("");
    const [path, setPath] = useState(null);
    const [tempLogoPath, setTempLogoPath] = useState("");
    const [awatarPath, setAwatarPath] = useState("");
    const { logout, isLogged, getUser } = authUser();

    useEffect(() => {
        const fetchData = async () => {
            if (isLogged) {
                console.log("isLogged");
                await getUserData();
            } else {
                userAwatar.current = "ico.png";
            }
            const { fetchImage, fetchAwatar } = await fetchImgFromStorage();
            if (userAwatar.current) {
                setPath(`/history/${userId.current}`);
                try {
                    const [awatarPath, tempLogoPath] = await Promise.all([
                        fetchAwatar(userAwatar.current),
                        fetchImage("tempLogo.png"),
                    ]);

                    setTempLogoPath(tempLogoPath);
                    setAwatarPath(awatarPath);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, [isLogged]);

    const getUserData = async () => {
        const user = await getUser();
        if (user.avatar === null) {
            user.avatar = "ico.png";
        }
        userAwatar.current = user.avatar;
        const avatarFileName = userAwatar.current.split("/").pop();
        userAwatar.current = avatarFileName;
        userId.current = user.id;
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
            <Link to={path}>
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
                {awatarPath ? (
                    <img
                        src={awatarPath}
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
                {aboutUsElement}
                {rulesElement}
            </ul>
        </>
    );
}
