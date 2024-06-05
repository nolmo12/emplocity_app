import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authUser from "../authUser";
import styles from "./popular.module.css";
export default function Popular() {
    const [popularData, setPopularData] = useState([]);
    const [userId, setUserId] = useState();
    const { isLogged, getUser, setError } = authUser();
    const fetchPopularUser = async () => {
        try {
            const response = await axios.get("/api/users/listing");
            setPopularData(response.data);
        } catch (error) {
            setError(error);
        }
    };
    useEffect(() => {
        getUserData();
        fetchPopularUser();
    }, []);

    const getUserData = async () => {
        if (isLogged()) {
            // wait for token update
            await new Promise((resolve) => setTimeout(resolve, 50));
            const response = await getUser();
            setUserId(response.id);
        }
    };
    return (
        <div id={styles.Popular}>
            <div id={styles.PopularContainer}>
                <div>
                    <h1>Popular</h1>
                </div>
                <div>
                    <ul data-testid="guestVideoList">
                        {popularData.map((user) => {
                            const awatarPath = user.avatar;
                            return (
                                <Link
                                    to={
                                        userId === user.id
                                            ? `/account`
                                            : `/user/${user.id}`
                                    }
                                    key={user.id}
                                >
                                    <li key={user.id}>
                                        <div className={styles.link_holder}>
                                            <div
                                                className={styles.image_holder}
                                            >
                                                <img
                                                    src={awatarPath}
                                                    alt="avatar"
                                                    className={
                                                        styles.profile_picture
                                                    }
                                                />
                                                {user.current_border && (
                                                    <img
                                                        src={
                                                            user.current_border
                                                                .type
                                                        }
                                                        className={
                                                            styles.border
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <p className={styles.text_center}>
                                                {user.name}
                                            </p>
                                        </div>
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
