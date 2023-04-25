import React, { useState, useCallback } from 'react';
import MyCalendar from './components/MyCalendar';
import MyChat from './components/MyChat';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import config from './configure';
import axios from 'axios';


import './App.css';

function App() {

  const [seed, setSeed] = useState(1);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [mailto, setMailto] = useState("");
  const [cc, setCc] = useState("");



  const [emailDisplay, setEmailDisplay] = useState(false);
  const [calendarDisplay, setCalendarDisplay] = useState(true);

  const updateCalendar = () => {
    setSeed(Math.random());
  }

  const updateEditor = (msg) => {
    const emailInfo = emailerParser(msg);
    setSubject(emailInfo.subject);
    setContent(newLineParser(emailInfo.content));
  }

  const sendEmail = () => {
    axios
      .post(`${config.apiUrl}/email/send`, { mailto, cc, subject, content })
      .then((res) => {
        if (res.data) {
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    clearEmailInputs(setMailto, setCc, setSubject, setContent);
  }

  function handleModeChange(mode) {
    if (mode === 3) {
      setEmailDisplay(true);
      setCalendarDisplay(false);
    } else {
      setEmailDisplay(false);
      setCalendarDisplay(true);
    }
  }

  return (
    <div className="app">

      <header className="app-header">
        GPT4U
      </header>
      <div className="main-container">
        <div className="upper-container">
          <div className={calendarDisplay ? "calendar-container" : "hide-container"}>

            <MyCalendar key={seed} />
          </div>
          <div className={emailDisplay ? "mail-container" : "hide-container"}>
            <div className='mailto'>
              <div>
                <label className='mailto-label'>Mailto: </label><input className="mailto-input"
                  type="text"
                  value={mailto}
                  onChange={(e) => setMailto(e.target.value)}
                />
              </div>
              <div>
                <label className='mailto-label'>CC: </label><input className="mailto-input"
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
              </div>
              <div>
                <label className='mailto-label'>Subject: </label><input className="mailto-input"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button type="button" onClick={sendEmail}>Send</button>
            </div>
            <ReactQuill theme="snow" value={content} onChange={setContent} />
          </div>


          <div className="chat-container">
            <h1>Chatbot</h1>
            <MyChat updateCalendar={updateCalendar} updateEditor={updateEditor} onModeChange={handleModeChange} />
          </div>
        </div>

        <div className="bottom-container">

          <div className="info-container">

          </div>
          <div className="other-container">

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


function emailerParser(message) {
  const results = { subject: "", content: "" };

  const subjuectRegex = /^Subject:(.+)\n/mi;
  const contentRegex = /\nContent:([\s\S]*)/s;

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

function newLineParser(message) {
  return message.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function handleNotification() {
  console.log("handle notification");
}

function clearEmailInputs(setMailto, setCc, setSubject, setContent) {
  setMailto("");
  setCc("");
  setSubject("")
  setContent("");
}