import styles from "./aboutUs.module.css";

export default function AboutUs() {
    return (
        <>
            <div className={styles.aboutUs}>
                <div className={styles.aboutUsh2}>
                    <h2>About us</h2>
                </div>

                <section>
                    <p>
                        Welcome to our website, a project crafted by a team of
                        four dedicated computer science students from the
                        University of Warmia and Mazury. This platform was
                        developed as part of our group project course in
                        collaboration with a renowned company.{" "}
                    </p>

                    <p>Our team</p>

                    <ul>
                        <li>
                            Paweł Bąk - Team Manager & Backend Developer &
                            DevOps & Database Administrator
                        </li>
                        <li>
                            Piotr Marcińczuk - Frontend Developer & QA Engineer{" "}
                        </li>
                        <li>
                            Andrzej Pliszka - Backend Developer & QA Engineer{" "}
                        </li>
                        <li>
                            Bartek Przycki - Frontend Developer & UI/UX Designer{" "}
                        </li>
                    </ul>

                    <p>Our Mission</p>

                    <p>
                        Our website is designed to provide a seamless
                        video-sharing experience, inspired by platforms like
                        Dailymotion and YouTube. We aimed to create a
                        user-friendly and efficient platform where users can
                        upload, share, and watch videos effortlessly.{" "}
                    </p>

                    <p>Our Vision</p>

                    <p>
                        Our vision is to continuously improve and expand our
                        platform, incorporating the latest technologies and user
                        feedback to deliver an exceptional experience. We are
                        passionate about fostering a community where creativity
                        and expression thrive through video content.{" "}
                    </p>

                    <p>Future Prospects</p>

                    <p>
                        As we continue our journey, we are committed to
                        enhancing the functionality and features of our
                        platform. Our goal is to not only meet but exceed the
                        expectations of our users, making our website a go-to
                        destination for video sharing and viewing.{" "}
                    </p>

                    <p>
                        Thank you for visiting our website. We hope you enjoy
                        the content and features we have created. Your feedback
                        is invaluable to us as we strive to make our platform
                        even better.
                    </p>
                </section>
            </div>
        </>
    );
}
