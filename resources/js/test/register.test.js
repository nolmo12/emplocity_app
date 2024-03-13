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
import Register from "../components/Register/Register";
import Login from "../components/Login/Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
jest.mock("axios");

describe("Register component test", () => {
    test("logo takes user to home page", () => {
        const history = createMemoryHistory();
        render(
            <Router>
                <Register />
            </Router>
        );
        const logoElement = screen.getByTestId("logo");
        userEvent.click(logoElement);
        expect(history.location.pathname).toBe("/");
    });
    test("email input changes when user types", () => {
        render(
            <Router>
                <Register />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Email");
        fireEvent.change(inputElement, { target: { value: "example@.com" } });
        expect(inputElement.value).toBe("example@.com");
    });
    test("password input changes when user types", () => {
        render(
            <Router>
                <Register />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Password");
        fireEvent.change(inputElement, { target: { value: "123456" } });
        expect(inputElement.value).toBe("123456");
    });
    test("repeat password input changes when user types", () => {
        render(
            <Router>
                <Register />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Repeat password");
        fireEvent.change(inputElement, { target: { value: "123456" } });
        expect(inputElement.value).toBe("123456");
    });
    test("send form data with inputs", async () => {
        axios.post.mockResolvedValue({});
        render(
            <Router>
                <Register />
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
            "http://127.0.0.1:8000/api/auth/register",
            {
                email: "example@.com",
                password: "123456",
                repeatPassword: "123456",
            }
        );
    });
});
