import Popular from "../Popular/Popular";
import VideoSection from "../VideoSection/VideoSection";
import styles from "./mainContent.module.css";
export default function MainContent() {
    return (
        <main>
            <Popular />
            <VideoSection />
        </main>
    );
}
