export function formatTime(timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat("id-ID", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  }
}
