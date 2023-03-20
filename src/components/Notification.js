import React from "react";
import './Notification.css';

export default function Notification({title, hasContent, handleNotification, disabled}) {
    const className=disabled? 'notification-top-bar disabled':'notification-top-bar';

    return (
        <div className={className}>
            {title}&nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" onClick={handleNotification}>Start now</button>
        </div>
    );
}
