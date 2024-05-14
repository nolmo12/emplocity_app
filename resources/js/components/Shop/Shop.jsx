import React from "react";
import { useState, useEffect } from "react";
import authUser from "../authUser";
export default function Shop() {
    const { http } = authUser();
    const [borders, setBorders] = useState([]);

    const fetchBorders = async () => {
        const response = await http.get("/api/shop/show");
        const responseData = response.data.toSorted(
            (a, b) => b.rarity - a.rarity
        );
        console.log(responseData);
        setBorders(responseData);
    };

    const handleClickBuy = async (borderId) => {
        // api call to buy border
        console.log(borderId);
    };

    useEffect(() => {
        fetchBorders();
    }, []);

    return (
        <ul>
            {borders.map((border) => {
                return (
                    <li key={`shop-${border.id}`}>
                        <img
                            style={{ width: "50px", height: "50px" }}
                            src={border.type}
                        ></img>
                        {border.price}
                        <button onClick={(e) => handleClickBuy(border.id)}>
                            Buy
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
