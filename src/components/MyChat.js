import React, { useState, useEffect } from 'react';
import axios from "axios";
import './MyChat.css';
import config from '../configure';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

const modes = [{ modeId: 1, modeName: "Small talk" },
{ modeId: 2, modeName: "Scheduler" },
{ modeId: 3, modeName: "Email Asistant" }];

export default function MyChat({ updateCalendar, updateEditor, onModeChange }) {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(0);
    const [mode, setMode] = useState(1);
    const scheduleStart = new Date();
    const scheduleEnd = new Date(new Date().setDate(scheduleStart.getDate() + 7));
    const [timeRange, setTimeRange] = useState([scheduleStart, scheduleEnd]);
    const [tentative, setTentative] = useState([]);
    const [calendarParts, setcalendarParts] = useState(false);
    const [emailParts, setEmailParts] = useState(false);


    // handle mode changes
    const handleModeChange = (event) => {
        event.preventDefault();
        if (window.confirm("Confirm mode change?")) {
            const modeVal = parseInt(event.target.value);
            setMode(modeVal);
            setSessionId(0);
            setPrompt("");
            setMessages([]);
            onModeChange(modeVal);
            if (modeVal === 2) {
                setcalendarParts(true);
                setEmailParts(false);
            } else if (modeVal == 3) {
                setcalendarParts(false);
                setEmailParts(true);
            } else {
                setcalendarParts(false);
                setEmailParts(false);
            }
        }
    }

    // Add tentative events to calendar
    const addToCalendar = (event) => {
        event.preventDefault();

        if (!sessionId) {
            console.log("No session id");
            return;
        }

        axios
            .post(`${config.apiUrl}/events/new`, { tentative })
            .then((res) => {
                if (res.data) {
                    console.log(res.data);
                    updateCalendar();
                }
            })
            .catch((err) => {
                console.error(err);
            });

    };

    // Adds last message to email editor
    const addToEditor = (event) => {
        event.preventDefault();

        if (!sessionId) {
            console.log("No session id");
            return;
        }

        const lastMsg = messages[messages.length - 1].content;
        updateEditor(lastMsg);

    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!prompt) {
            console.log("No prompt");
            return;
        };

        axios
            .post(`${config.apiUrl}/chat`, { mode, sessionId, prompt, timeRange })
            .then((res) => {
                if (res.data) {
                    setMessages(res.data);

                    setSessionId(res.data[0].sessionId);

                    const lastMsg = res.data[res.data.length - 1].content;

                    const content = parseSchedule(lastMsg);

                    const scheduleObj = parseCsv(content);
                    const convertedObj = convertToEvents(scheduleObj, "tentative");

                    setTentative(convertedObj);
                    setPrompt("");
                }
            })
            .catch((err) => {
                console.error(err);
            });

    };

    return (
        <div className="my-chat">
            <div className='msg-container-outer'>
                <div className="msg-container">
                    {messages && messages.slice().reverse().map(({ role, content, orderNum }) =>
                        <div className={role}>
                            <span className="chat-role">{role}</span>
                            <div className="chat-msg" key={orderNum + 1}>
                                <span>{content}</span>
                            </div>

                        </div>
                    )}
                </div>
            </div>
            <div className="input-container">

                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className={calendarParts ? "show-range-picker" : "hide"}>
                        <DateTimeRangePicker onChange={setTimeRange} value={timeRange} />
                    </div>

                    <div className='input-section'>
                        <select className='mode-selector' value={mode} onChange={handleModeChange}>
                            {modes && modes.map(({ modeId, modeName }) =>
                                <option value={modeId} key={modeId}>{modeName}</option>
                            )}
                        </select>

                        <textarea className="chat-input"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button type="submit" className='add-to-btn'>Submit</button>
                    </div>
                </form>


                <button type="button" className={calendarParts ? 'add-to-btn' : 'hide'} onClick={addToCalendar}>Add to calendar</button>
                <button type="button" className={emailParts ? 'add-to-btn' : 'hide'} onClick={addToEditor}>Add to editor</button>

                <div className={calendarParts ? "tentative-container" : "hide"}>
                    <table>
                        <thead>
                            <tr key="tentative-container-title">
                                <th>Start</th>
                                <th>End</th>
                                <th>Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tentative && tentative.length > 0 && tentative.map(({ start, end, title }, index) =>
                                <tr className="chat-msg darker" key={index}>
                                    <td>{start.toLocaleString("en-CA")}</td>
                                    <td>{end.toLocaleString("en-CA")}</td>
                                    <td>{title}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}



// Convert CSV to object
export function parseCsv(csv) {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');

    return rows.slice(1).map((row) => {
        const values = row.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
        }, {});
    });
}

// Parses schedule string given by gpt response
export function parseSchedule(content) {

    const regex = /\n[\s\S]*Start of schedule\n([\s\S]*)\n[\s\S]*End of schedule/i;

    const match = regex.exec(content);

    if (match && match[1]) {
        return "start,end,title\n" + match[1].trim();
    }

    return '';
}

export function convertToEvents(events, status) {
    return events.map(obj => {
        return { start: new Date(obj.start), end: new Date(obj.end), title: obj.title, status: status }
    });
}
