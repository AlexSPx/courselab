export default function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
