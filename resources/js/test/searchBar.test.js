import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import SearchBar from "../components/SearchBar/SearchBar";
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
    test("testing user typing in the input", () => {
        render(
            <Router>
                <SearchBar />
            </Router>
        );
        const inputElement = screen.getByRole("textbox");
        expect(inputElement).toBeInTheDocument();
        inputElement.value = "test";
        expect(inputElement.value).toBe("test");
    });
});
