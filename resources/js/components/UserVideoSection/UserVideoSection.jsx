import React from "react";
import Video from "../Video/Video";
import styles from "./userVideoSection.module.css";

export default function UserVideoSection() {
    return (
        <div id={styles.UserVideoSection}>
            <table>
                <tr>
                    <th id={styles.VideoHeader}>My video</th>
                    <th>Date</th>
                    <th>Views</th>
                    <th>Comments</th>
                    <th>Likes</th>
                </tr>
                <tr>
                    <td>
                        <Video />
                    </td>
                    <td className={styles.tdContent}>20-02-2024</td>
                    <td className={styles.tdContent}>551</td>
                    <td className={styles.tdContent}>14</td>
                    <td className={styles.tdContent}>28</td>
                </tr>
            </table>
        </div>
    );
}
