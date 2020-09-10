// @ts-ignore
import * as ICAL from "ical.js";
import axios from "axios";
import State from "../utils/state";
import { CalendarEvent } from "../utils/models";

const calUrl =
  "https://calendar.google.com/calendar/ical/webmaster%40d-sektionen.se/public/basic.ics";

const makeMonthDayString = (date: Date, state: State) => {
  const day = date.getDate();
  // @ts-ignore
  const month = state.strings.months[date.getMonth()];
  return `${day} ${month.substr(0, 3)}`;
};

const makeDTString = (event: ICAL.Event, state: State) => {
  const startDate = event.startDate.toJSDate();
  const endDate = event.endDate.toJSDate();
  const startDateString = makeMonthDayString(startDate, state);

  if (event.duration.compare(new ICAL.Duration({ days: 1 })) === -1) {
    const startTime = startDate.toLocaleString("sv", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = endDate.toLocaleString("sv", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${startDateString}, ${startTime}-${endTime}`;
  }
  const endDateAdjusted = new Date(endDate);
  endDateAdjusted.setSeconds(startDate.getSeconds() - 1);
  const endDateAdjustedString = makeMonthDayString(endDateAdjusted, state);
  if (
    event.endDate
      .subtractDate(event.startDate)
      .compare(new ICAL.Duration({ days: 1 })) === 1
  ) {
    return `${startDateString} - ${endDateAdjustedString}`;
  }
  return startDateString;
};

const getEventData = async (state: State): Promise<void> => {
  const res = await axios.get(calUrl);

  // parse data to ical.js vevents
  const icalString = res.data;
  const jcalData = ICAL.parse(icalString);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");

  const events = vevents
    // convert a vevent to an event ("Component Model Layer" to "Item Model Layer")
    // more info: https://github.com/mozilla-comm/ical.js/wiki
    .map((vevent: ICAL.VEvent) => new ICAL.Event(vevent))
    // filter out old events
    .filter((event: ICAL.Event) => {
      const nowPlus21Days = ICAL.Time.now();
      nowPlus21Days.addDuration(new ICAL.Duration({ days: 21 }));
      return (
        event.endDate.compare(ICAL.Time.now()) >= 0 &&
        event.startDate.compare(nowPlus21Days) <= 0
      );
    })
    // sort the events by start date
    .sort((a: ICAL.Event, b: ICAL.Event) => a.startDate.compare(b.startDate))
    // convert to simple object with all the data that's used to display the event
    .map(
      (event: ICAL.Event) =>
        new CalendarEvent(event.summary, makeDTString(event, state))
    );

  // start: event.startDate.toJSDate().toISOString(),
  // end: event.endDate.toString()

  state.addEvents(events);
};

export default getEventData;
