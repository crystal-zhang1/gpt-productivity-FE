import React from "react";
import './Notification.css';

export default function Notification({title, hasContent, handleNotification, active}) {
    const className=active? 'notification-top-bar':'notification-top-bar disabled';

    return (
        <div className={className}>
            {title}&nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" onClick={handleNotification}>Start now</button>
        </div>
    );
}
