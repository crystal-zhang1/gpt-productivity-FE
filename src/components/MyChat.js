import React, { useState } from 'react';
import axios from "axios";
import './MyChat.css';
import config from '../configure';

const modes = [{ modeId: 1, modeName: "Small talk" },
{ modeId: 2, modeName: "Scheduler" },
{ modeId: 3, modeName: "Email Asistant" }];

export default function MyChat() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(0);
    const [mode, setMode] = useState(2);

    const handleModeChange = (event) => {
        event.preventDefault();
        setMode(event.target.value);
    }

    const addToCalendar = (event) => {
        event.preventDefault();

        if (!sessionId) {
            console.log("No session id");
            return;
        }

        axios
            .post(`${config.apiUrl}/events/new`, { sessionId })
            .then((res) => {
                if (res.data) {
                    console.log(res.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!prompt) {
            console.log("No prompt");
            return
        };

        // const newMsg = [...messages, { type: "user", content: prompt }];
        // setMessages(newMsg);
        axios
            .post(`${config.apiUrl}/chat`, { mode, sessionId, prompt })
            .then((res) => {
                if (res.data) {
                    setMessages(res.data);
                    setSessionId(res.data[0].sessionId);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <div className="my-chat">
            <div className="msg-container">
                {messages && messages.map(({ role, content, orderNum }) =>
                    <div className="chat-msg darker" key={orderNum + 1}>
                        <span>{role}: </span>
                        <span>{content}</span>
                    </div>
                )}
            </div>
            <div className="input-container">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <select value={mode} onChange={handleModeChange}>
                        {modes && modes.map(({ modeId, modeName }) =>
                            <option value={modeId} key={modeId}>{modeName}</option>
                        )}
                    </select>
                    <input className="chat-input"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
                <button type="button" onClick={addToCalendar}>Add to calendar</button>
            </div>

        </div>
    );
}
