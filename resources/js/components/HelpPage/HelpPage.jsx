import React from "react";
import styles from "./helpPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faAlignLeft,
    faEnvelope
 } from "@fortawesome/free-solid-svg-icons";

export default function HelpPage() {
    return (
        <>
            <section className={styles.helpForm}>
                <form data-testid="problemForm">
                    <div>
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className={styles.helpFormIcon}
                        />
                        <input
                            type="text"
                            placeholder="Enter your email"
                        ></input>
                        <FontAwesomeIcon
                            icon={faAlignLeft}
                            className={styles.helpFormIcon}
                        />
                        <textarea
                            placeholder="Describe your problem"
                            data-testid="problemInput"
                            className={styles.descriptionArea}
                            rows="5"
                        />
                    </div>
                    <button>Send</button>
                </form>
            </section>
            <section className={styles.helpInfo}>
                <h2 className={styles.contact}>Contact</h2>
                <ul data-testid="ulHelp">
                    Email: <li>pomocsznyca@gmail.com</li>
                    Phone: <li>123-456-789</li>
                    Address: <li>ul. Kozia 1, 00-001 Warszawa</li>
                </ul>
            </section>
        </>
    );
}
