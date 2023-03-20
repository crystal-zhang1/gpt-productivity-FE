import React, { useState, useEffect, useRef } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { getDefaultSchedule } from '../utils/scheduler-helper';
import axios from 'axios';
import config from '../configure';
import { Store } from 'react-notifications-component';
import Notification from './Notification';

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';

const localizer = dayjsLocalizer(dayjs);
const DnDCalendar = withDragAndDrop(Calendar);
let intervalStarted = false;

export default function MyCalendar() {
  const defaultDate = dayjs().toDate();

  const [eventList, setEventList] = useState([]);
  const [notify, setNotify] = useState(false);
  const [currEvent, setCurrEvent] = useState();

  const latestEventList = useRef(eventList);
  latestEventList.current = eventList;


  useEffect(() => {
    axios
      .get(`${config.apiUrl}/events/active`)
      .then((res) => {
        if (res.data) {
          //console.log("events: " + res.data);
          const mappedEvents = mapAttributes(res.data);
          //console.log("mappedEvents: " + mappedEvents);
          setEventList(mappedEvents);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);



  useEffect(() => {
    const intervalId = setInterval(() => {
      latestEventList.current && latestEventList.current.forEach(event => {
        const currTime = new Date();
        // console.log("setInterval(event): ", event);
        // console.log(currTime);
        if (compareTime(event.start, currTime)) {
          // todo: add content
          setCurrEvent(event);
          setNotify(true);
          // showNotification();
        }
      })
    }, 5000);

    // return a cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [eventList]);


  const createNewEvent = (data) => {
    // console.log(notify);
    // // sendNotify(eventList, setCurrEvent, setNotify);
    // console.log(notify);
    const { start, end } = data;
    const title = window.prompt('New Event name')
    if (title) {
      setEventList((prev) => [...prev, { start, end, title }]);

    }
  }





  return (
    <div className="my-calendar">
      <Notification title="my title" active={notify} />
      <DnDCalendar
        defaultDate={defaultDate}
        defaultView="week"
        localizer={localizer}
        events={eventList}
        onSelectEvent={(data) => { console.log("select"); handleSelectEvent(data); }}
        onSelectSlot={(data) => { console.log("Slot"); createNewEvent(data); }}
        onEventDrop={(data) => { console.log("Drop"); updateEvent(data, eventList, setEventList); }}
        onEventResize={(data) => { console.log("Resize"); updateEvent(data, eventList, setEventList); }}
        resizable
        selectable
        scrollToTime={dayjs().set("hour", 8).set("minute", 0).set("second", 0).set("millisecond", 0)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
    </div>
  );
}

async function updateEvent(data, eventList, setEventList) {
  const { start, end, event } = data;

  await setEventList(
    eventList.map(item =>
      item.id === event.id
        ? { ...event, start, end }
        : item
    ));
}

function handleSelectEvent(data, eventList, setNotify) {

}

function mapAttributes(events) {
  if (!events) {
    return;
  }
  return events.map((obj, index) => {
    return { id: index, start: new Date(obj.start), end: new Date(obj.end), title: obj.title }
  });
}

// function sendNotify(eventList, setCurrEvent, setNotify) {
//   setInterval(() => {
//     eventList && eventList.forEach(event => {
//       const currTime = new Date();
//       console.log(event);
//       console.log(currTime);
//       if (compareTime(event.start, currTime)) {
//         // todo: add content
//         setCurrEvent(event);
//         setNotify(true);
//         // showNotification();
//       }
//     })
//   }, 60000);
// }

function compareTime(time1, time2) {
  console.log("time1", time1);
  console.log("time2", time2);
  const roundedTime1 = Math.trunc(time1.getTime() / 60000);
  const roundedTime2 = Math.trunc(time2.getTime() / 60000);
  console.log("time1", roundedTime1);
  console.log("time2", roundedTime2);
  return roundedTime1 === roundedTime2;
}

// function showNotification() {
//   Store.addNotification({
//     title: "Wonderful!",
//     message: "teodosii@react-notifications-component",
//     type: "success",
//     insert: "top",
//     container: "top-right",
//     animationIn: ["animate__animated", "animate__fadeIn"],
//     animationOut: ["animate__animated", "animate__fadeOut"],
//     dismiss: {
//       duration: 5000,
//       onScreen: true
//     }
//   });
// }


function handleNotification() {
  // todo: call chatgpt
  console.log("handle notification");
}