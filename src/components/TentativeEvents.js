import React from "react";

export default function TentativeEvents({ tentative }) {

    return (

        <div className="tentative-container">
            <table>
                <thead>
                    <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Event</th>
                    </tr>
                </thead>
                <tbody>
                    {tentative && tentative.length > 0 && tentative.map(({ id, start, end, title }) =>
                        <tr className="chat-msg darker" key={id}>
                            <td>{title}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
