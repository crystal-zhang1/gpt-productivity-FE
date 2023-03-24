import React from "react";
import './Notification.css';

export default function Notification({title, active}) {
    const className=active? 'notification-top-bar':'notification-top-bar disabled';
    // const className=active? 'notification-top-bar disabled':'notification-top-bar';

    return (
        <div className={className}>
            {title}
            {/* <button type="button" onClick={handleNotification}>Start now</button> */}
        </div>
    );
}
