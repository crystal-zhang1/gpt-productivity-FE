import React, { useState, useCallback } from 'react';
import MyCalendar from './components/MyCalendar';
import MyChat from './components/MyChat';

import './App.css';

function App() {

  return (
    <div className="app">
      <header className="app-header">
        GPT4U
      </header>
      <div className="main-container">
        <div className="upper-container">
          <div className="chat-container">
            <MyChat />
          </div>
          <div className="calendar-container">
            <MyCalendar />
          </div>
        </div>
        <div className="bottom-container">
          <div className="info-container">Info</div>
          <div className="other-container">
            Other Info
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
