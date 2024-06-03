import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authUser from "../authUser";
import styles from "./settings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload,
    faUser,
    faHistory,
    faQuestionCircle,
    faThumbsUp,
    faStore,
    faSignOutAlt,
    faInfoCircle,
    faGavel,
    faUserFriends,
} from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
    const { logout, isLogged, getUser } = authUser();
    const [historyPath, setHistoryPath] = useState();
    const [likedPath, setLikedPath] = useState();
    const [followsPath, setFollowsPath] = useState();

    useEffect(() => {
        if (!isLogged()) {
            return;
        } else {
            const getUserData = async () => {
                // wait for token update
                await new Promise((resolve) => setTimeout(resolve, 50));
                const user = await getUser();
                setHistoryPath(`/history/${user.id}`);
                setLikedPath(`/user-likes/${user.id}`);
                setFollowsPath(`/follows/${user.id}`);
            };
            getUserData();
        }
    }, [historyPath, likedPath]);

    return (
        <div id={styles.Settings}>
            <h1>Settings</h1>
            <ul data-testid="settingsList">
                <li>
                    <Link to="/account-settings" className={styles.link}>
                        <FontAwesomeIcon
                            icon={faUser}
                            className={styles.settingsIcon}
                        />
                        Account settings
                    </Link>
                </li>
                <li>
                    <Link to="/upload" className={styles.link}>
                        <FontAwesomeIcon
                            icon={faUpload}
                            className={styles.settingsIcon}
                        />
                        Upload
                    </Link>
                </li>
                <li>
                    <Link to={historyPath} className={styles.link}>
                        <FontAwesomeIcon
                            icon={faHistory}
                            className={styles.settingsIcon}
                        />
                        History
                    </Link>
                </li>
                <li>
                    <Link to={likedPath} className={styles.link}>
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={styles.settingsIcon}
                        />
                        Liked videos
                    </Link>
                </li>
                <li>
                    <FontAwesomeIcon
                        icon={faUserFriends}
                        className={styles.settingsIcon}
                    />
                    <Link to={followsPath} className={styles.link}>
                        My follows
                    </Link>
                </li>
                <li>
                    <Link to="/shop" className={styles.link}>
                        <FontAwesomeIcon
                            icon={faStore}
                            className={styles.settingsIcon}
                        />
                        Shop
                    </Link>
                </li>
                <li>
                    <Link to="/help" className={styles.link}>
                        <FontAwesomeIcon
                            icon={faQuestionCircle}
                            className={styles.settingsIcon}
                        />
                        Help
                    </Link>
                </li>
                <li>
                    <Link to="/about-us" className={styles.link}>
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            className={styles.settingsIcon}
                        />
                        About us
                    </Link>
                </li>
                <li>
                    <Link to="/rules" className={styles.link}>
                        <FontAwesomeIcon
                            icon={faGavel}
                            className={styles.settingsIcon}
                        />
                        Rules
                    </Link>
                </li>
                <li onClick={logout}>
                    <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className={styles.settingsIcon}
                    />
                    Logout
                </li>
            </ul>
        </div>
    );
}
