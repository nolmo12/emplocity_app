import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";
import styles from "./popular.module.css";

export default function Popular() {
    const [popularData, setPopularData] = useState([]);
    const { http } = authUser();
    const fetchPopularUser = async () => {
        try {
            const response = await http.get("/api/users/listing");
            setPopularData(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchPopularUser();
    }, []);
    return (
        <div id={styles.Popular}>
            <h1>Popular</h1>
            <ul data-testid="guestVideoList">
                {/* {popularData.map((user) => {
                    return (
                        <li>
                            <img src="avatar" alt="avatar" />
                            <p>{user.userName}</p>
                        </li>
                    );
                })} */}
            </ul>
        </div>
    );
}
