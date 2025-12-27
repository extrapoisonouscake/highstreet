import { parseIcsCalendar } from "@ts-ics/schema-zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { cacheLife } from "next/cache";
import { IcsEvent, type IcsCalendar } from "ts-ics";
import {
  calendarID,
  calendarScopeID,
  LOUNGE_BOOKING_EVENT_PREFIX,
} from "./constants";

const calendarURL = `https://outlook.office365.com/owa/published/${calendarScopeID}/${calendarID}/calendar.ics`;
dayjs.extend(timezone);
dayjs.extend(utc);
const INSTANTIATED_TIMEZONE = "America/Vancouver";
dayjs.tz.setDefault(INSTANTIATED_TIMEZONE);
const timezonedDayJS = (...args: Parameters<typeof dayjs>) => {
  return dayjs(...args).tz(INSTANTIATED_TIMEZONE);
};
type EventWithEndDate = Extract<IcsEvent, { end: { date: Date } }>;
export async function IsLoungeBooked() {
  "use cache";
  cacheLife("hours");
  const response = await fetch(calendarURL);
  const data = await response.text();
  const { events }: IcsCalendar = parseIcsCalendar(data);
  if (!events) return <p className="text-xl text-red-500">чето не так</p>;
  const now = timezonedDayJS();

  const upcomingEvents = events.filter((event): event is EventWithEndDate => {
    const eventDate = timezonedDayJS(event.start.date);
    return (
      event.summary.startsWith(LOUNGE_BOOKING_EVENT_PREFIX) &&
      eventDate.isSame(now, "day") &&
      eventDate.isAfter(now) &&
      !!event.end
    );
  });
  if (upcomingEvents.length === 0) {
    return (
      <p className="text-4xl font-bold text-green-500 animate-bounce [animation-duration:.4s]">
        cвободно, fuck yeah!!!!
      </p>
    );
  }

  return (
    <p className="text-3xl font-bold leading-normal">
      NOOOO😭😭!! седня лаундж занят {formatEventsSummary(upcomingEvents)}
      😡
    </p>
  );
}
const timeFormat = "h:mm A";
function formatEventsSummary(events: EventWithEndDate[]) {
  let str = "";
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    str += `с ${timezonedDayJS(event.start.date).format(timeFormat)} до ${timezonedDayJS(
      event.end.date,
    ).format(timeFormat)}`;
    if (i < events.length - 2) {
      str += ", ";
    } else if (i < events.length - 1) {
      str += " и ";
    }
  }
  return str;
}
