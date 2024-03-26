import React from "react";
import {
    render,
    screen,
    act,
    fireEvent,
    findByPlaceholderText,
} from "@testing-library/react";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import Message from "../components/Message/Message";
import "@testing-library/jest-dom";

describe("Message component test", () => {
    test("testing paragraph message visibility", async () => {
        render(
            <Router>
                <Message message="Hello test" />
            </Router>
        );
        await act(async () => {
            const paragraphElement = screen.getByText("Hello test");
            expect(paragraphElement).toBeInTheDocument();
        });
    });
    test("testing button click", async () => {
        render(
            <Router>
                <Message message="Hello test" />
            </Router>
        );
        await act(async () => {
            const buttonElement = screen.getByText("Okay");
            expect(buttonElement).toBeInTheDocument();
            fireEvent.click(buttonElement);
        });
    });
});
