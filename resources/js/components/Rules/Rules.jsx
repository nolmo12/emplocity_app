import styles from "./rules.module.css";

export default function Rules() {
    return (
        <>
            <div className={styles.rules}>
                <h3>Rules</h3>
                <section>
                    <ol>
                        <li>
                            User-generated content
                            <ul>
                                <li>
                                    Users are responsible for all content they share
                                    on our site, including comments, videos, photos,
                                    and other materials.
                                </li>
                                <li>
                                    Sharing content that is:
                                    <ul>
                                        <li>offensive, vulgar, or illegal;</li>
                                        <li>
                                            infringing upon the copyrights or
                                            intellectual property rights of others;
                                        </li>
                                        <li>
                                            promoting violence, hate,
                                            discrimination, or intolerance towards
                                            other groups or individuals is
                                            prohibited.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    We reserve the right to remove any content that
                                    violates the above rules and to block access to
                                    our site for users who share such content.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Privacy
                            <ul>
                                <li>We respect the privacy of our users.</li>
                                <li>
                                    Users are not permitted to share the personal
                                    data of others without their consent.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Copyright
                            <ul>
                                <li>
                                    Users must respect the copyrights of others.
                                    Sharing materials to which the user does not
                                    have appropriate rights is prohibited.
                                </li>
                                <li>
                                    If a user believes that their copyrights have
                                    been violated by content shared on our site,
                                    please contact our support team through the
                                    "Help" page.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Prohibited actions
                            <ul>
                                <li>
                                    It is prohibited to:
                                    <ul>
                                        <li>breach the security of the site;</li>
                                        <li>
                                            misuse site functions, such as reporting
                                            content.
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>
                            Reporting violations
                            <ul>
                                <li>
                                    Users can report violations of the terms of
                                    service through the contact form available on
                                    our site under the name "Help."
                                </li>
                                <li>
                                    All reports will be reviewed by our team, and
                                    appropriate actions will be taken to address the
                                    issue.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Changes to the terms of service
                            <ul>
                                <li>
                                    We reserve the right to change the terms of
                                    service at any time.
                                </li>
                                <li>
                                    Continuing to use our site after changes have
                                    been made signifies acceptance of the new terms.
                                </li>
                            </ul>
                        </li>
                    </ol>
                </section>
            </div>
        </>
    );
}
