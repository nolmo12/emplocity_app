import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchVideosSearch from "../useFetchVideosSearch";
import styles from "./searchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
    const [data, setData] = useState("");
    const { fetchSearchedVideos } = useFetchVideosSearch();
    const navigate = useNavigate();

    function handleChange(e) {
        setData(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            if (data) search();
        }
    }

    const handleClick = () => {
        if (data) search();
    };

    const search = async () => {
        navigate(`/search-result/${data}/popularity`);
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
