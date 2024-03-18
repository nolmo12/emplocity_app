import React from "react";
import Video from "../Video/Video";

export default function UserVideoSection() {
    return (
        <div>
            <table>
                <tr>
                    <th>My video</th>
                    <th>Date</th>
                    <th>Views</th>
                    <th>Comments</th>
                    <th>Likes</th>
                </tr>
                <tr>
                    <td>
                        <Video />
                    </td>
                    <td>20-02-2024</td>
                    <td>551</td>
                    <td>14</td>
                    <td>28</td>
                </tr>
            </table>
        </div>
    );
}
