import { useState } from "react";
import authUser from "./authUser";
export default function useBorders() {
    const { http } = authUser();
    const getBorders = async () => {
        const response = await http.get(`/api/auth/borders`);
        console.log("user borders: ", response.data);
        return response.data;
    };

    const getCurrentBorder = async (userId) => {
        const response = await http.get(`/api/auth/currentBorder/${userId}`);
        return response.data;
    };

    const handleClickBorder = async (borderId, setCurrentBorder) => {
        const response = await http.patch(`/api/auth/changeCurrentBorder`, {
            borderId: borderId,
        });
        console.log(borderId);
        if (response) setCurrentBorder(response.data.border.type);
        console.log("user clicl border: ", response.data.border.type);
    };
    return { getBorders, getCurrentBorder, handleClickBorder };
}
