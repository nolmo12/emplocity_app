import React from "react";
import { useState } from "react";

export default function useValidation() {
    const validateForm = (type, data) => {
        if (type === "register" && data) {
            const validationInfo = {
                emailValidation: false,
                passwordValidation: false,
                repeatPasswordValidation: false,
            };
            data.forEach((errorObj) => {
                Object.entries(errorObj).forEach(([key, value]) => {
                    if (key == 461) {
                        validationInfo.emailValidation = true;
                    }
                    if (key == 462) {
                        validationInfo.passwordValidation = true;
                    }
                    if (key == 463) {
                        validationInfo.repeatPasswordValidation = true;
                    }
                });
            });
            return validationInfo;
        }
    };

    return {
        validateForm,
    };
}
