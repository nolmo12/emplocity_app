// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import { BrowserRouter as Router } from "react-router-dom";
// import "@testing-library/jest-dom";
// import userEvent from "@testing-library/user-event";
// import { createMemoryHistory } from "history";
// import RegisterOrLogin from "../components/RegisterOrLogin/RegisterOrLogin";
// describe("RegisterOrLogin component test", () => {
//     test("testing <form> render", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin />
//             </Router>
//         );
//         const formElement = screen.getByTestId("form");
//         expect(formElement).toBeInTheDocument();
//     });
//     test("email input changes when user types", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin />
//             </Router>
//         );
//         const inputElement = screen.getByPlaceholderText("Email");
//         fireEvent.change(inputElement, { target: { value: "example@.com" } });
//         expect(inputElement.value).toBe("example@.com");
//     });
//     test("password input changes when user types", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin />
//             </Router>
//         );
//         const inputElement = screen.getByPlaceholderText("Password");
//         fireEvent.change(inputElement, { target: { value: "123456" } });
//         expect(inputElement.value).toBe("123456");
//     });
//     test("repeat password input changes when user types", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin componentType="register" />
//             </Router>
//         );
//         const inputElement = screen.getByPlaceholderText("Repeat password");
//         fireEvent.change(inputElement, { target: { value: "123456" } });
//         expect(inputElement.value).toBe("123456");
//     });
//     test("is Repeat password input visiable for Register", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin componentType="register" />
//             </Router>
//         );
//         const inputElementRegister =
//             screen.getByPlaceholderText("Repeat password");
//     });
//     test("is Repeat password input not visiable for Login", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin componentType="login" />
//             </Router>
//         );
//         const inputElementLogin =
//             screen.queryByPlaceholderText("Repeat password");
//         expect(inputElementLogin).not.toBeInTheDocument();
//     });
//     test("is Forgot password? visiable for Register", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin componentType="register" />
//             </Router>
//         );
//         const forgotPasswordElement = screen.queryByTestId("forgotPassword");
//         expect(forgotPasswordElement).not.toBeInTheDocument();
//     });
//     test("is Forgot password? visiable for Login", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin componentType="login" />
//             </Router>
//         );
//         const forgotPasswordElement = screen.queryByTestId("forgotPassword");
//         expect(forgotPasswordElement).toBeInTheDocument();
//     });
//     test("is Register button visiable for Register and Login button not visiable", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin componentType="register" />
//             </Router>
//         );
//         const buttonElementRegister = screen.getByText("Register");
//         expect(buttonElementRegister).toBeInTheDocument();
//         const buttonElementLogin = screen.queryByText("Login");
//         expect(buttonElementLogin).not.toBeInTheDocument();
//     });
//     test("is Login button visiable for Login and Register button not visiable", () => {
//         render(
//             <Router>
//                 <RegisterOrLogin componentType="login" />
//             </Router>
//         );
//         const buttonElementLogin = screen.getByText("Login");
//         expect(buttonElementLogin).toBeInTheDocument();
//         const buttonElementRegister = screen.queryByText("Register");
//         expect(buttonElementRegister).not.toBeInTheDocument();
//     });
//     test("navigate to / after img click", () => {
//         const history = createMemoryHistory();
//         render(
//             <Router>
//                 <RegisterOrLogin />
//             </Router>
//         );
//         const imgElement = screen.getByRole("img");
//         userEvent.click(imgElement);
//         expect(history.location.pathname).toBe("/");
//     });
//     //this must be fixed, it checks if the link is there but it doesn't check if it navigates to the right place
//     test("navigate to /login after 'I already have an account' click", () => {
//         const history = createMemoryHistory();
//         render(
//             <Router history={history}>
//                 <RegisterOrLogin componentType="register" />
//             </Router>
//         );
//         const linkElement = screen.getByRole("link", {
//             name: "I already have an account",
//         });
//         expect(linkElement).toBeInTheDocument();
//     });
//     //this must be fixed, it checks if the link is there but it doesn't check if it navigates to the right place
//     test("navigate to /register after 'Create account' click", () => {
//         const history = createMemoryHistory();
//         render(
//             <Router history={history}>
//                 <RegisterOrLogin componentType="login" />
//             </Router>
//         );
//         const linkElement = screen.getByRole("link", {
//             name: "Create account",
//         });
//         expect(linkElement).toBeInTheDocument();
//     });
// });
