import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authUser from "../authUser";
import useUser from "../useUser";
import useBorders from "../useBorders";
import styles from "./shop.module.css";

export default function Shop() {
    const [userData, setUserData] = useState({});
    const [userBorders, setUserBorders] = useState([]);
    const [borders, setBorders] = useState([]);
    const { getBorders } = useBorders();
    const { http } = authUser();
    const { getUser } = useUser();
    const navigate = useNavigate();

    const getUserData = async () => {
        setUserData(await getUser());
        setUserBorders(await fetchBorders());
    };

    const fetchBorders = async () => {
        try {
            const response = await http.get("/api/shop/show");
            console.log(response.data);
            const responseData = response.data.toSorted(
                (a, b) => b.rarity - a.rarity
            );
            setBorders(responseData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickBuy = async (borderId) => {
        try {
            const response = await http.get(
                `/web/payment/create/border?itemId=${borderId}&firstname=${userData.firstname}&lastname=Maro&email=kon@wp.pl&phone=123456789`
            );
            if (response.data) navigate(response.data.url);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBorders();
    }, []);

    return (
        <ul className={styles.borderShop} onClick={(e) => handleClickBuy(border.id)}>
            <h1>Border Shop</h1>
            {borders.map((border) => {
                return (
                    <li key={`shop-${border.id}`}>
                        <img
                            src={border.type}
                            className={styles.border}
                        ></img>
                        <p>
                            Price: <span>{border.price}</span>
                        </p>
                        <button onClick={(e) => handleClickBuy(border.id)}>
                            Buy
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
