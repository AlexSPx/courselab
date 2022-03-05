import { isServer } from "./isServer";

export default function formatDate(date: Date | undefined) {
  if (isServer) return;
  if (!date) return;
  console.log(date);

  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
