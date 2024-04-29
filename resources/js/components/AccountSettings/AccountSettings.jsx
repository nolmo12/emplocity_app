import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";
import styles from "./accountSettings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

export default function AccountSettings() {
    const [user, setUser] = useState();
    const [passwordFlag, setPasswordFlag] = useState(false);
    const [userData, setUserData] = useState({
        first_name: "",
        password: "",
    });
    const { http, getUser } = authUser();

    useEffect(() => {
        getUser().then((data) => {
            setUser(data);
        });
    }, []);

    const handleChangePassword = (e) => {
        setUserData({ ...userData, password: e.target.value });
    };

    const handleChangeNickname = (e) => {
        setUserData({ ...userData, nickname: e.target.value });
    };

    const handleClickSave = async (e) => {
        // api call to save new password
    };

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
                                    value={userData.nickname || user.name}
                                    onChange={(e) => handleChangeNickname(e)}
                                />
                                <p>Nickname</p>
                                {passwordFlag ? (
                                    <>
                                        <input
                                            type="password"
                                            onChange={(e) =>
                                                handleChangePassword(e)
                                            }
                                        ></input>
                                        <p>Old password</p>
                                        <input
                                            type="password"
                                            onChange={(e) =>
                                                handleChangePassword(e)
                                            }
                                        ></input>
                                        <p>New password</p>
                                        <button
                                            onClick={(e) => handleClickSave(e)}
                                        >
                                            Save new password
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setPasswordFlag(!passwordFlag)
                                        }
                                    >
                                        Change password
                                    </button>
                                )}

                                <input type="file" id="file" />
                                <button className={styles.uploadIconP}>
                                    Change avatar
                                </button>
                            </form>
                            <p className={styles.borderSetting}>
                                Premium border {user.border_id ? "yes" : "no"}
                            </p>
                        </>
                    </div>
                )}
            </div>
        </main>
    );
}
