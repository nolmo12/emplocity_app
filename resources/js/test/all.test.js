import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import MainContent from "../components/MainContent/MainContent";
import Popular from "../components/Popular/Popular";
import RegisterOrLogin from "../components/RegisterOrLogin/RegisterOrLogin";
describe("Header component test", () => {
    test("testing <header> render", () => {
        render(
            <Router>
                <Header />
            </Router>
        );
        const headerElement = screen.getByRole("banner");
        expect(headerElement).toBeInTheDocument();
    });
    test("testing <img> elements render", () => {
        render(
            <Router>
                <Header />
            </Router>
        );
        const imgElements = screen.getAllByRole("img");
        expect(imgElements.length).toBe(3);
    });
});
describe("SearchBar component test", () => {
    test("testing <input> render", () => {
        render(
            <Router>
                <SearchBar />
            </Router>
        );
        const inputElement = screen.getByRole("textbox");
        expect(inputElement).toBeInTheDocument();
    });
    test("testing <img> render", () => {
        render(
            <Router>
                <SearchBar />
            </Router>
        );
        const imgElement = screen.getByRole("img");
        expect(imgElement).toBeInTheDocument();
    });
});
describe("MainContent component test", () => {
    test("testing <main> render", () => {
        render(
            <Router>
                <MainContent />
            </Router>
        );
        const mainElement = screen.getByRole("main");
        expect(mainElement).toBeInTheDocument();
    });
});
describe("Popular component test", () => {
    test("testing Popular-text render", () => {
        render(
            <Router>
                <Popular />
            </Router>
        );
        const h1Element = screen.getByText("Popular");
        expect(h1Element).toBeInTheDocument();
    });
    test("testing <ul> render", () => {
        render(
            <Router>
                <Popular />
            </Router>
        );
        const ulElements = screen.getAllByRole("listitem");
        expect(ulElements.length).toBe(6);
    });
});
describe("RegisterOrLogin component test", () => {
    test("testing <form> render", () => {
        render(
            <Router>
                <RegisterOrLogin />
            </Router>
        );
        const formElement = screen.getByTestId("form");
        expect(formElement).toBeInTheDocument();
    });
    test("email input changes when user types", () => {
        render(
            <Router>
                <RegisterOrLogin />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Email");
        fireEvent.change(inputElement, { target: { value: "example@.com" } });
        expect(inputElement.value).toBe("example@.com");
    });
    test("is Forgot email? visiable for Register", () => {
        render(
            <Router>
                <RegisterOrLogin componentType="register" />
            </Router>
        );
        const forgotEmailElement = screen.queryByTestId("forgotEmail");
        expect(forgotEmailElement).not.toBeInTheDocument();
    });
    test("is Forgot email? visiable for Login", () => {
        render(
            <Router>
                <RegisterOrLogin componentType="login" />
            </Router>
        );
        const forgotEmailElement = screen.queryByTestId("forgotEmail");
        expect(forgotEmailElement).toBeInTheDocument();
    });
    test("password input changes when user types", () => {
        render(
            <Router>
                <RegisterOrLogin />
            </Router>
        );
        const inputElement = screen.getByPlaceholderText("Password");
        fireEvent.change(inputElement, { target: { value: "123456" } });
        expect(inputElement.value).toBe("123456");
    });
    test("is Forgot password? visiable for Register", () => {
        render(
            <Router>
                <RegisterOrLogin componentType="register" />
            </Router>
        );
        const forgotPasswordElement = screen.queryByTestId("forgotPassword");
        expect(forgotPasswordElement).not.toBeInTheDocument();
    });
    test("is Forgot password? visiable for Login", () => {
        render(
            <Router>
                <RegisterOrLogin componentType="login" />
            </Router>
        );
        const forgotPasswordElement = screen.queryByTestId("forgotPassword");
        expect(forgotPasswordElement).toBeInTheDocument();
    });
    test("is Register button visiable for Register and Login button not visiable", () => {
        render(
            <Router>
                <RegisterOrLogin componentType="register" />
            </Router>
        );
        const buttonElementRegister = screen.getByText("Register");
        expect(buttonElementRegister).toBeInTheDocument();
        const buttonElementLogin = screen.queryByText("Login");
        expect(buttonElementLogin).not.toBeInTheDocument();
    });
    test("is Login button visiable for Login and Register button not visiable", () => {
        render(
            <Router>
                <RegisterOrLogin componentType="login" />
            </Router>
        );
        const buttonElementLogin = screen.getByText("Login");
        expect(buttonElementLogin).toBeInTheDocument();
        const buttonElementRegister = screen.queryByText("Register");
        expect(buttonElementRegister).not.toBeInTheDocument();
    });
    test("navigate to / after img click", () => {
        const history = createMemoryHistory();
        render(
            <Router>
                <RegisterOrLogin />
            </Router>
        );
        const imgElement = screen.getByRole("img");
        userEvent.click(imgElement);
        expect(history.location.pathname).toBe("/");
    });
    test("navigate to /login after 'I already have an account' click", () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <RegisterOrLogin componentType="register" />
            </Router>
        );
        const linkElement = screen.queryByTestId("fromRegisterToLogin");
        userEvent.click(linkElement);
        expect(history.location.pathname).toEqual("/login");
    });
});
// chyba 2 testy zostaly z RegistOrLogin
