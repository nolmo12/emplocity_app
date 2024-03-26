import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Header from "../components/Header/Header";
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
