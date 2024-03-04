import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RegisterOrLogin from "../components/RegisterOrLogin/RegisterOrLogin";

describe("RegisterOrLogin component", () => {
    test("renders RegisterOrLogin component", () => {
        const { getByText, getByPlaceholderText } = render(
            <RegisterOrLogin componentType="register" />
        );
    });
});
