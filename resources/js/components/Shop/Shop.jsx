import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authUser from "../authUser";
import useBorders from "../useBorders";
import styles from "./shop.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";

export default function Shop() {
    const [userData, setUserData] = useState({});
    const [userBorders, setUserBorders] = useState([]);
    const [borders, setBorders] = useState([]);
    const { getBorders } = useBorders();
    const { http, getUser } = authUser();
    const navigate = useNavigate();

    const getUserData = async () => {
        const user = await getUser();
        setUserData(user);
        setUserBorders(await fetchBorders());
    };

    const fetchBorders = async () => {
        try {
            const response = await http.get("/api/shop/show");
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
                `/web/payment/create/border?itemId=${borderId}&firstname=${userData.firstname}&lastname=Maro&email=kon@wp.pl&phone=48123456789`
            );
            if (response.data) window.open(response.data.url);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
        fetchBorders();
    }, []);

    return (
        <ul className={styles.borderShop}>
            <h1>Border Shop</h1>
            {borders.map((border) => {
                return (
                    <li key={`shop-${border.id}`}>
                        <div className={styles.borderContainer}>
                            <div className={styles.borderAvatarContainer}>
                                <img
                                    src={border.type}
                                    className={styles.border}
                                    alt="border"
                                />
                                <img
                                    src={userData.avatar}
                                    className={styles.avatar}
                                    alt="user avatar"
                                />
                            </div>
                            <div className={styles.infoContainer}>
                                <p>{border.name}</p>
                                <p>
                                    Price: <span>{border.price}</span>
                                </p>
                                <div>
                                    <button
                                        onClick={() =>
                                            handleClickBuy(border.id)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faShoppingBasket}
                                            className={styles.shopIcon}
                                        />
                                        Buy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
