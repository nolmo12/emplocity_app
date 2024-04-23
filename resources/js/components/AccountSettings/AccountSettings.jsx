import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";
import styles from "./accountSettings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUpload
} from "@fortawesome/free-solid-svg-icons";

export default function AccountSettings() {
    const [user, setUser] = useState();
    const [userData, setUserData] = useState({
        first_name: "",
        nickname: "",
    });
    const { http, getUser } = authUser();

    useEffect(() => {
        getUser().then((data) => {
            setUser(data);
        });
    }, []);

    const handleChangeFirstName = (e) => {
        setUserData({ ...userData, first_name: e.target.value });
    };

    const handleChangeNickname = (e) => {
        setUserData({ ...userData, nickname: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(userData);
            // api call
        } catch (error) {
            console.log(error);
        }
    };

    console.log(user);
    return (
        <main>
            <div className={styles.settingsDiv}>
                {user && (
                    <div className={styles.userInfoForm}>
                        <>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <h3>User Info</h3>
                                <input
                                    type="text"
                                    value={userData.first_name || user.first_name}
                                    onChange={(e) => handleChangeFirstName(e)}
                                />
                                <p>Change first name</p>
                                <input
                                    type="text"
                                    value={userData.nickname || user.name}
                                    onChange={(e) => handleChangeNickname(e)}
                                />
                                <p>Change nickname</p>
                                <p className={styles.borderSetting}>Premium border {user.border_id ? "yes" : "no"}</p>
                                <FontAwesomeIcon
                                    icon={faUpload}
                                    className={styles.uploadIcon}
                                />
                                <p className={styles.uploadIconP}>Change avatar</p>
                                <button>Save</button>
                            </form>
                        </>
                    </div>
                )}
            </div>
        </main>
    );
}
