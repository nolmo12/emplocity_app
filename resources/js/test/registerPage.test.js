import React from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    logRoles,
} from "@testing-library/react";
import {
    MemoryRouter,
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import RegisterPage from "../components/RegisterPage/RegisterPage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../components/Register/registerOrLogin.module.css";
jest.mock("axios");

describe("Register component test", () => {
    test("email input changes when user types", () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Email");
        fireEvent.change(inputElement, { target: { value: "example@.com" } });
        expect(inputElement.value).toBe("example@.com");
    });
    test("password input changes when user types", () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Password");
        fireEvent.change(inputElement, { target: { value: "123456" } });
        expect(inputElement.value).toBe("123456");
    });
    test("repeat password input changes when user types", () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Repeat password");
        fireEvent.change(inputElement, { target: { value: "123456" } });
        expect(inputElement.value).toBe("123456");
    });
    test("email input changes class based on state", () => {
        const { getByPlaceholderText } = render(
            <Router>
                <RegisterPage />
            </Router>
        );
    });
    test("send form data with correct inputs", async () => {
        axios.post.mockResolvedValue({});
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const formElement = screen.getByTestId("form");
        const emailInputElement = screen.getByPlaceholderText("Email");
        const passwordInputElement = screen.getByPlaceholderText("Password");
        const repeatPasswordInputElement =
            screen.getByPlaceholderText("Repeat password");

        fireEvent.change(emailInputElement, {
            target: { value: "example@.com" },
        });
        fireEvent.change(passwordInputElement, { target: { value: "123456" } });
        fireEvent.change(repeatPasswordInputElement, {
            target: { value: "123456" },
        });
        fireEvent.submit(formElement);
        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost/api/auth/register",
            {
                email: "example@.com",
                password: "123456",
                repeatPassword: "123456",
            }
        );
        expect(emailInputElement).not.toHaveClass("invalid");
        expect(passwordInputElement).not.toHaveClass("invalid");
        expect(repeatPasswordInputElement).not.toHaveClass("invalid");
    });
    test("send form data with incorrect inputs", async () => {
        axios.post.mockResolvedValue({});
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const formElement = screen.getByTestId("form");
        const emailInputElement = screen.getByPlaceholderText("Email");
        const passwordInputElement = screen.getByPlaceholderText("Password");
        const repeatPasswordInputElement =
            screen.getByPlaceholderText("Repeat password");

        fireEvent.change(emailInputElement, {
            target: { value: "e.com" },
        });
        fireEvent.change(passwordInputElement, { target: { value: "" } });
        fireEvent.change(repeatPasswordInputElement, {
            target: { value: "123456" },
        });
        fireEvent.submit(formElement);
        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost/api/auth/register",
            {
                email: "e.com",
                password: "",
                repeatPassword: "123456",
            }
        );
        expect(screen.getAllByRole("paragraph")).toHaveLength(3);
    });
    test("testing 'I already have an account' visibility", async () => {
        render(
            <Router>
                <RegisterPage />
            </Router>
        );
        const linkElement = screen.getByText("I already have an account");
        expect(linkElement).toBeInTheDocument();
    });
});
