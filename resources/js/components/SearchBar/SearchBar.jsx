import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import authUser from "../authUser";
import styles from "./searchBar.module.css";

export default function SearchBar() {
    const [data, setData] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    ``;
    const suggestionsRef = useRef();
    const navigate = useNavigate();
    const { http } = authUser();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        console.log("click");
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchSuggestions = async (item) => {
        const response = await http.get(
            `/api/video/search?query=${item}&page=1&per_page=6&is_typing_in_search_input=1`
        );

        return response.data;
    };

    const handleChange = async (e) => {
        setData(e.target.value);
        if (e.target.value) {
            setSuggestions(await fetchSuggestions(e.target.value));
        } else {
            setSuggestions([]);
        }
    };

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            if (data) search();
        }
    }

    const handleClick = () => {
        if (data) search();
    };

    const search = (item = data) => {
        setData("");
        setSuggestions([]);
        navigate(`/search-result/${item}/popularity`);
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchBarLoop}>
                <input
                    type="text"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={styles.searchBar}
                    placeholder="Search"
                    value={data}
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    onClick={handleClick}
                    className={styles.searchLoop}
                />
            </div>
            {suggestions && suggestions.length > 0 && (
                <ul className={styles.ulItem} ref={suggestionsRef}>
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            className={styles.searchItem}
                            onClick={() => {
                                setData(item);
                                search(item);
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSearch}
                                className={styles.searchLoopSuggestion}
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
