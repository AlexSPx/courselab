export default function index(seconds: number | undefined) {
  if (!seconds) return;
  if (seconds < 3600)
    return new Date(seconds * 1000)
      .toISOString()
      .replace(/.*(\d{2}:\d{2}).*/, "$1");

  return new Date(seconds * 1000)
    .toISOString()
    .replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
