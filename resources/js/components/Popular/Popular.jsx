import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authUser from "../authUser";
import styles from "./popular.module.css";

export default function Popular() {
    const [popularData, setPopularData] = useState([]);
    const [userId, setUserId] = useState();
    const { getUser, isLogged } = authUser();
    const fetchPopularUser = async () => {
        try {
            const response = await axios.get("/api/users/listing");
            setPopularData(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getUserData();
        fetchPopularUser();
    }, []);

    const getUserData = async () => {
        if (!isLogged()) return;
        const response = await getUser();
        setUserId(response.id);
    };
    return (
        <div id={styles.Popular}>
            <h1>Popular</h1>
            <ul data-testid="guestVideoList">
                {popularData.map((user) => {
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
                                <img src="avatar" alt="avatar" />
                                <p>{user.name}</p>
                            </li>
                        </Link>
                    );
                })}
            </ul>
        </div>
    );
}
