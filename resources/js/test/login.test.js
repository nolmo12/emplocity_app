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
import authUser from "../components/authUser";
import { useNavigate } from "react-router-dom";
jest.mock("axios", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
        create: jest.fn(() => ({
            post: jest.fn(),
        })),
    },
}));
jest.mock("../components/authUser");
describe("Login component test", () => {
    test("logo takes user to home page", () => {
        const history = createMemoryHistory();
        render(
            <Router>
                <Login />
            </Router>
        );
        const logoElement = screen.getByTestId("logo");
        userEvent.click(logoElement);
        expect(history.location.pathname).toBe("/");
    });
    test("email input changes when user types", () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Email");
        fireEvent.change(inputElement, { target: { value: "example@.com" } });
        expect(inputElement.value).toBe("example@.com");
    });
    test("password input changes when user types", () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Password");
        fireEvent.change(inputElement, { target: { value: "123456" } });
        expect(inputElement.value).toBe("123456");
    });
    test("send form data with inputs", async () => {
        const mockPost = jest.fn().mockResolvedValue({});
        authUser.mockReturnValue({
            http: { post: mockPost },
            setToken: jest.fn(),
            token: "",
            getToken: jest.fn(),
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        const formElement = screen.getByTestId("form");
        const emailInputElement = screen.getByPlaceholderText("Email");
        const passwordInputElement = screen.getByPlaceholderText("Password");

        fireEvent.change(emailInputElement, {
            target: { value: "123@wp.pl" },
        });
        fireEvent.change(passwordInputElement, { target: { value: "123" } });

        fireEvent.submit(formElement);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledTimes(1);
        });
    });
});
