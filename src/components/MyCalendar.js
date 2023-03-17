import React, { useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { getDefaultSchedule } from '../utils/scheduler-helper'

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';

const localizer = dayjsLocalizer(dayjs);
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const defaultDate = dayjs().toDate();

  const defaultSchedule = getDefaultSchedule();
  const myEventList = [
    {
      id: 0,
      title: 'Half hour event very long title',
      start: defaultSchedule.start,
      end: defaultSchedule.end
    }
  ];

  const [eventList, setEventList] = useState(myEventList);

  return (
    <div className="my-calendar">
      <DnDCalendar
        defaultDate={defaultDate}
        defaultView="week"
        localizer={localizer}
        events={eventList}
        onSelectEvent={(data) => { console.log("select"); handleSelectEvent(data); }}
        onSelectSlot={(data) => { console.log("Slot"); createNewEvent(data, setEventList); }}
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

function createNewEvent(data, setEventsList) {
  const { start, end } = data;
  const title = window.prompt('New Event name')
  if (title) {
    setEventsList((prev) => [...prev, { start, end, title }])
  }
}

function updateEvent(data, eventList, setEventList) {
  const { start, end, event } = data;

  setEventList(
    eventList.map(item =>
      item.id === event.id
        ? { ...event, start, end }
        : item
    ));
}

function handleSelectEvent (data) {
  console.log(data);
}
