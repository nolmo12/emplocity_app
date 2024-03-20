import React from "react";
import { useState, useEffect } from "react";
import fetchImage from "../fetchImgFromStorage";
import styles from "./searchBar.module.css";

export default function SearchBar() {
    const [loopPath, setLoopPath] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loopPath = await fetchImage("loop.png");
                setLoopPath(loopPath);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);
    return (
        <div id={styles.searchBarLoop}>
            <input type="text" id={styles.searchBar}></input>
            {loopPath && (
                <img
                    src={loopPath}
                    alt="SearchLoop"
                    id={styles.searchLoop}
                ></img>
            )}
        </div>
    );
}
