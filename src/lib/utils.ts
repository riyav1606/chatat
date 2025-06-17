import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(date_ms: number): string {
  const date_obj = new Date(date_ms);
  const current_date = new Date();
  current_date.setHours(0, 0, 0, 0);

  const provided_date = new Date(date_obj);
  provided_date.setHours(0, 0, 0, 0);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  if (provided_date.getTime() === current_date.getTime()) {
    return date_obj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (provided_date.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  if (provided_date.getTime() > current_date.getTime() - 6 * 24 * 60 * 60 * 1000) {
    return provided_date.toLocaleDateString(undefined, { weekday: "long" });
  }

  return `${provided_date.getMonth() + 1}/${provided_date.getDate()}/${provided_date.getFullYear()}`;
}
export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
export const getRelativeDateTime = (
  message: { _creationTime: number },
  previousMessage?: { _creationTime: number }
): string | undefined => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const messageDate = new Date(message._creationTime);

  if (!previousMessage || !isSameDay(previousMessage._creationTime, messageDate.getTime())) {
    if (isSameDay(messageDate.getTime(), today.getTime())) {
      return "Today";
    } else if (isSameDay(messageDate.getTime(), yesterday.getTime())) {
      return "Yesterday";
    } else if (messageDate.getTime() > lastWeek.getTime()) {
      return messageDate.toLocaleDateString(undefined, { weekday: "long" });
    } else {
      return messageDate.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }

  return undefined;
};
export function randomID(len = 5): string {
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
