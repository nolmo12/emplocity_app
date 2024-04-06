import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./searchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setQuery(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            navigate("/search-result");
        }
    }

    const handleClick = () => {
        navigate("/search-result");
    };

    return (
        <div id={styles.searchBarLoop}>
            <input
                type="text"
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                id={styles.searchBar}
            ></input>
            <FontAwesomeIcon
                icon={faSearch}
                onClick={handleClick}
                id={styles.searchLoop}
            />
        </div>
    );
}
