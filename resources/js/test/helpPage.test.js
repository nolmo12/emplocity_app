import React from "react";
import {
    render,
    screen,
    act,
    fireEvent,
    findByPlaceholderText,
} from "@testing-library/react";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import HelpPage from "../components/HelpPage/HelpPage";
import "@testing-library/jest-dom";

describe("HelpPage component test", () => {
    test("testing form rendering", async () => {
        render(
            <Router>
                <HelpPage />
            </Router>
        );
        const form = screen.getByTestId("problemForm");
        const input = screen.getByTestId("problemInput");
        const button = screen.getByText("Send");
        expect(form).toBeInTheDocument();
        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });
    test("testing ul rendering", async () => {
        render(
            <Router>
                <HelpPage />
            </Router>
        );
        const ul = screen.getByTestId("ulHelp");
        const liElements = ul.querySelectorAll("li");
        expect(liElements.length).toBe(3);
    });
});
