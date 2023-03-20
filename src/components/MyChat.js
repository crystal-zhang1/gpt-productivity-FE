import React, { useState, useEffect } from 'react';
import axios from "axios";
import './MyChat.css';
import config from '../configure';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import TentativeEvents from './TentativeEvents.js';

const modes = [{ modeId: 1, modeName: "Small talk" },
{ modeId: 2, modeName: "Scheduler" },
{ modeId: 3, modeName: "Email Asistant" }];

export default function MyChat({ updateCalendar, updateEditor }) {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(0);
    const [mode, setMode] = useState(2);
    const scheduleStart = new Date();
    const scheduleEnd = new Date().setDate(scheduleStart.getDate() + 7);
    const [timeRange, setTimeRange] = useState([scheduleStart, scheduleEnd]);
    const [tentative, setTentative] = useState([]);

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

    const addToEditor = (event) => {
        event.preventDefault();

        if (!sessionId) {
            console.log("No session id");
            return;
        }

        const lastMsg = messages[messages.length - 1].content;
        updateEditor(lastMsg);

    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!prompt) {
            console.log("No prompt");
            return
        };

        // const newMsg = [...messages, { type: "user", content: prompt }];
        // setMessages(newMsg);
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
                }
            })
            .catch((err) => {
                console.error(err);
            });

    };

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
                    <div>
                        <DateTimeRangePicker onChange={setTimeRange} value={timeRange} />
                    </div>
                    <select value={mode} onChange={handleModeChange}>
                        {modes && modes.map(({ modeId, modeName }) =>
                            <option value={modeId} key={modeId}>{modeName}</option>
                        )}
                    </select>

                    <textarea className="chat-input"
                        //type="textarea"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>

                <div className="tentative-container">
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

                <button type="button" onClick={addToCalendar}>Add to calendar</button>
                <button type="button" onClick={addToEditor}>Add to editor</button>
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

export function parseSchedule(content) {

    const regex = /\n[\s\S]*Start of schedule\n([\s\S]*)\n[\s\S]*End of schedule/i;
    // const regex = /[\s\S]*(start of schedule)\\n/;
    //const regex = /\n[\s\S]*(start of schedule)\n/;
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



function emailerParser(message) {
    const results = { subject: "", content: "" };
  
    const subjuectRegex = /Subject:([\s\S]*)\n/i;
    const contentRegex = /\nContent:([\s\S]*)/i;
  
    const subjectMatch = subjuectRegex.exec(message);
  
    if (subjectMatch && subjectMatch[1]) {
        results.subject = subjectMatch[1].trim();
    }
  
    const contentMatch = contentRegex.exec(message);
  
    if (contentMatch && contentMatch[1]) {
        results.content = contentMatch[1].trim();
    }
  
    return results;
  
  }
  