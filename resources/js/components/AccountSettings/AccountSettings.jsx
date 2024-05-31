import React, { useState, useEffect, useRef } from "react";
import authUser from "../authUser";
import useUser from "../useUser";
import { Link, useNavigate } from "react-router-dom";
import useUserSettings from "../useUserSettings";
import styles from "./accountSettings.module.css";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useBorders from "../useBorders";

export default function AccountSettings() {
    const [user, setUser] = useState(null);
    const [userBorders, setUserBorders] = useState([]);
    const [imageLoaded, setImageLoaded] = useState({
        avatar: false,
    });
    const [renderKey, setRenderKey] = useState(0);
    const [currentBorder, setCurrentBorder] = useState([]);
    const [userData, setUserData] = useState({
        nickname: "",
        previousPassword: "",
        password: "",
        repeatPassword: "",
        avatar: "",
    });
    const [validationPasswordData, setValidationPasswordData] = useState(false);
    const [validationNicknameData, setValidationNicknameData] = useState(false);
    const { getBorders, getCurrentBorder, handleClickBorder } = useBorders();
    const [removeFlag, setRemoveFlag] = useState(false);
    const { logout, getUser } = authUser();
    const { removeUser } = useUser();
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { changeNickname, changePassword, changeAvatar } = useUserSettings();

    useEffect(() => {
        const getUserId = async () => {
            try {
                const response = await getUser();
                setUser(response);
            } catch (error) {
                console.log(error);
            }
        };
        getUserId();
    }, []);

    useEffect(() => {
        getUserBorders();
    }, []);

    useEffect(() => {
        if (user && user.id) {
            getCurrentUserBorder();
        }
    }, [user]);

    const getUserBorders = async () => {
        const response = await getBorders();
        setUserBorders(response);
    };

    const getCurrentUserBorder = async () => {
        const response = await getCurrentBorder(user.id);
        setCurrentBorder(response.current_border.type);
        setRenderKey((prev) => prev + 1);
    };

    const handleNicknameChange = (e) => {
        e.preventDefault();
        setUserData({ ...userData, nickname: e.target.value });
    };

    const handlePasswordChange = (e, type) => {
        if (type === "password") {
            setUserData({ ...userData, password: e.target.value });
        } else if (type === "previous") {
            setUserData({ ...userData, previousPassword: e.target.value });
        } else {
            setUserData({ ...userData, repeatPassword: e.target.value });
        }
    };

    const handleClickChangeNickname = async (e) => {
        e.preventDefault();
        const response = await changeNickname(user.id, userData.nickname);
        if (response) {
            setValidationNicknameData(response);
            const updatedUser = await getUser();
            setUser((prevUser) => ({ ...prevUser, name: updatedUser.name }));
        } else {
            setValidationNicknameData(false);
        }
        setUserData({ ...userData, nickname: "" });
        setValidationPasswordData(false);
    };

    const handleClickChangePassword = async (e) => {
        e.preventDefault();
        const response = await changePassword(
            user.id,
            userData.previousPassword,
            userData.password,
            userData.repeatPassword
        );
        if (response) {
            navigate("/login");
            logout();
            setValidationPasswordData(response);
        } else {
            setValidationPasswordData(false);
            setUserData({
                ...userData,
                previousPassword: "",
                password: "",
                repeatPassword: "",
            });
        }
        setValidationNicknameData(false);
    };

    const handleClickRemoveAccount = async (e) => {
        e.preventDefault();
        setRemoveFlag(!removeFlag);
    };

    const handleClickClearAvatar = (e) => {
        e.preventDefault();
        document.getElementById("avatar-input").value = "";
        setUserData({ ...userData, avatar: "" });
    };

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        setUserData({ ...userData, avatar: e.target.files[0] });
    };

    const handleClickChangeAvatar = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("avatar", userData.avatar);
        await changeAvatar(user.id, userData.avatar);
        setUser((prevUser) => ({
            ...prevUser,
            avatar: URL.createObjectURL(userData.avatar),
        }));
        setUserData({ ...userData, avatar: "" });
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <main className={styles.accountSettingsPage}>
            <div className={styles.settingsDiv}>
                <div className={styles.divFormContainer}>
                    <Link to="/account">
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={styles.uploadFormCloseIcon}
                        />
                    </Link>
                    {user ? (
                        <div className={styles.userInfoForm}>
                            <>
                                <h3>User Info</h3>
                                <div>
                                    <p>
                                        <span className={styles.label}>
                                            First name:{" "}
                                        </span>
                                        <span>{user.first_name}</span>
                                    </p>
                                    <p>
                                        <span className={styles.label}>
                                            Nickname:{" "}
                                        </span>
                                        <span>{user.name}</span>
                                    </p>
                                    <p>
                                        <span className={styles.label}>
                                            Created at:{" "}
                                        </span>
                                        <span>
                                            {user.created_at.substring(0, 10)}
                                        </span>
                                    </p>
                                    <div className={styles.avatarBorderContainer}>
                                        <p>
                                            {user.avatar ? (
                                                <>
                                                    {!imageLoaded.avatar && (
                                                        <ClipLoader color="#000" />
                                                    )}
                                                    <img
                                                        src={user.avatar}
                                                        alt="avatar"
                                                        onLoad={() =>
                                                            setImageLoaded(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    avatar: true,
                                                                })
                                                            )
                                                        }
                                                        className={
                                                            styles.userAvatar
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <ClipLoader color="#000" />
                                            )}
                                        </p>
                                            {currentBorder && (
                                                <img
                                                    src={currentBorder}
                                                    alt="current border"
                                                    className={styles.userBorder}
                                                />
                                            )}
                                        </div>
                                        {userBorders &&
                                            userBorders.borders &&
                                            userBorders.borders.length > 0 && (
                                                <p className={styles.label}>
                                                    User borders:{" "}
                                                </p>
                                            )}
                                        <p>
                                            {userBorders &&
                                                userBorders.borders &&
                                                userBorders.borders.map((item) => (
                                                    <img
                                                        src={item.type}
                                                        alt="border"
                                                        onClick={() =>
                                                            handleClickBorder(
                                                                item.id,
                                                                setRenderKey
                                                            )
                                                        }
                                                        key={`userBorder${item.id}`}
                                                        className={
                                                            styles.ownedBorders
                                                        }
                                                    />
                                                ))}
                                        </p>
                                </div>
                            </>
                        </div>
                    ) : (
                        <ClipLoader color="#000" />
                    )}
                    <form>
                        <input
                            type="text"
                            onChange={(e) => handleNicknameChange(e)}
                            value={userData.nickname}
                            placeholder="New nickname"
                            className={styles.floatingInput}
                        />
                        <button
                            className={styles.changeNickname}
                            onClick={(e) => handleClickChangeNickname(e)}
                        >
                            Change nickname
                        </button>
                        {validationNicknameData.nicknameValidation && (
                            <p>The Nickname field must be a string</p>
                        )}
                        <input
                            type="password"
                            onChange={(e) => handlePasswordChange(e, "previous")}
                            value={userData.previousPassword}
                            placeholder="Previous password"
                            className={styles.floatingInput}
                        />
                        {validationPasswordData.previousPasswordValidation && (
                            <p>The current password field must be a string</p>
                        )}
                        <input
                            type="password"
                            onChange={(e) => handlePasswordChange(e, "password")}
                            value={userData.password}
                            placeholder="New password"
                            className={styles.floatingInput}
                        />
                        <input
                            type="password"
                            onChange={(e) => handlePasswordChange(e, "repeat")}
                            value={userData.repeatPassword}
                            placeholder="Repeat new password"
                            className={styles.floatingInput}
                        />
                        {validationPasswordData && (
                            <p>The password field must be a string</p>
                        )}
                        <button
                            className={styles.changePassword}
                            onClick={(e) => handleClickChangePassword(e)}
                        >
                            Change password
                        </button>
                        <div className={styles.avatarSettings}>
                            <div className={styles.avatarInputContainer}>
                                <input
                                    type="file"
                                    ref={inputRef}
                                    onChange={(e) => handleChangeAvatar(e)}
                                    id="avatar-input"
                                    className={styles.avatarInput}
                                />
                            </div>
                            {userData.avatar && (
                                <div>
                                    <p>Selected Avatar:</p>
                                    <img
                                        src={URL.createObjectURL(userData.avatar)}
                                        alt="Selected Avatar"
                                        className={styles.selectedAvatar}
                                    />
                                    <button
                                        onClick={handleClickClearAvatar}
                                        className={styles.clearAvatarButton}
                                    >
                                        Clear Avatar
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={(e) => handleClickChangeAvatar(e)}
                            className={styles.avatarButton}
                        >
                            Change avatar
                        </button>
                        <button
                            className={styles.removeButton}
                            onClick={(e) => handleClickRemoveAccount(e)}
                        >
                            Remove Account
                        </button>
                        {removeFlag && (
                            <>
                                <p>Are you sure?</p>
                                <button onClick={() => removeUser(user.id)}>
                                    Yes
                                </button>
                                <button onClick={() => setRemoveFlag(!removeFlag)}>
                                    No
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
