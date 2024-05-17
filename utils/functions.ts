const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getPreviousDateByMonths(startDate: string, months: number) {
  // Convert the start date to a Date object if it's not already one
  const date = new Date(startDate);

  // Get the original day of the month
  const day = date.getDate();

  // Subtract the number of months
  date.setMonth(date.getMonth() - months);

  // Check if the new month has fewer days than the original date
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  // If the new month has fewer days, adjust the day to the last day of the month
  if (day > daysInMonth) {
    date.setDate(daysInMonth);
  } else {
    date.setDate(day);
  }

  return date;
}

export function getDaySuffix(day: string) {
  return day === "1" || day === "21" || day === "31"
    ? day + "st"
    : day === "2" || day === "22"
    ? day + "nd"
    : day === "3" || day === "23"
    ? day + "rd"
    : day + "th";
}

export function formatDate(date: Date) {
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${getDaySuffix(String(day))}, ${year}`;
}

export function parseDate(dateString: string) {
  // Ensure the input matches the "YYYY-MM-DD" format
  const [year, month, day] = dateString.split("-").map(Number);

  // Months are zero-indexed in JavaScript's Date object (0 = January, 11 = December)
  return new Date(year, month - 1, day);
}
