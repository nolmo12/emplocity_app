import React from "react";
import { useState } from "react";

export default function useValidation() {
    const [nicknameValidation, setNicknameValidation] = useState({
        nicknameValidation: false,
    });
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
        if (type === "upload" && data) {
            const validationInfo = {
                titleValidation: false,
                languageValidation: false,
                videoValidation: false,
                visibilityValidation: false,
            };
            data.forEach((errorObj) => {
                Object.entries(errorObj).forEach(([key, value]) => {
                    if (key == 471) {
                        validationInfo.videoValidation = true;
                    }
                    if (key == 472) {
                        validationInfo.titleValidation = true;
                    }
                    if (key == 473) {
                        validationInfo.languageValidation = true;
                    }
                    if (key == 474) {
                        validationInfo.visibilityValidation = true;
                    }
                });
            });
            return validationInfo;
        }
        if (type === "accountSettings" && data) {
            const validationInfo = {
                nameValidation: false,
                passwordValidation: false,
            };
            if (data.length === 1) {
                if (data[0].includes("The name field must be a string.")) {
                    validationInfo.nameValidation = true;
                }
            } else {
                validationInfo.passwordValidation = true;
            }
            return validationInfo;
        }
    };

    return {
        validateForm,
    };
}
