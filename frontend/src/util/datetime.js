import moment from "moment";

export function getTimeFromDateString(date) {
  return getTimeFromDate(new Date(date));
}

export function getTimeFromDate(date) {
  const hours = date.getHours().toString().length === 2 ? date.getHours() : `0${date.getHours()}`;
  const minutes = date.getMinutes().toString().length == 2 ? date.getMinutes() : `0${date.getMinutes()}`;
  const time = `${hours}:${minutes}`;

  return time;
}

export function dateTimeToString(date, format = 'DD.MM.YYYY. HH:mm') {
  return moment(date).format(format);
}