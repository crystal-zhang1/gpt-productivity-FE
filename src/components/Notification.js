import React from "react";
import './Notification.css';

export default function Notification({title, active}) {
    const className=active? 'notification-top-bar':'notification-top-bar disabled';

    return (
        <div className={className}>
            {title}
        </div>
    );
}
