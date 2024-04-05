import React from "react";

export default function HelpPage() {
    return (
        <>
            <section>
                <form data-testid="problemForm">
                    <input
                        type="text"
                        placeholder="Describe your problem"
                        data-testid="problemInput"
                    />
                    <button>Send</button>
                </form>
            </section>
            <section>
                <h2>Contact</h2>
                <ul data-testid="ulHelp">
                    Email: <li>pomocsznyca@gmail.com</li>
                    Phone: <li>123-456-789</li>
                    Address: <li>ul. Kozia 1, 00-001 Warszawa</li>
                </ul>
            </section>
        </>
    );
}
