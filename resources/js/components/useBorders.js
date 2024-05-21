import { useState } from "react";
import authUser from "./authUser";
export default function useBorders() {
    const { http } = authUser();
    const getBorders = async () => {
        const response = await http.get(`/api/auth/borders`);
        return response.data;
    };

    const getCurrentBorder = async () => {
        const response = await http.get(`/api/auth/currentBorder`);
        return response.data;
    };

    const handleClickBorder = async (borderId) => {
        const response = await http.patch(
            `/api/auth/changeCurrentBorder/${borderId}`
        );
    };
    return { getBorders, getCurrentBorder, handleClickBorder };
}
