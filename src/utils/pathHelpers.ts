import { Message, StalenessStatus } from "../types/path";

export const getLineColor = (raw: string): string => {
  const [first] = raw.split(",").map((c) => c.trim());
  return first ? (first.startsWith("#") ? first : `#${first}`) : "#666";
};

export const heat = (secs: number): string =>
  isNaN(secs)
    ? ""
    : secs <= 300
    ? "text-green-400"
    : secs <= 600
    ? "text-yellow-400"
    : "text-red-400";

export const arrivalClass = (message: Message): string =>
  message.arrivalTimeMessage.toLowerCase().includes("delay")
    ? "text-red-500 font-semibold"
    : heat(parseInt(message.secondsToArrival, 10));

export const getStalenessStatus = (
  lastUpdated: string | null,
  error: string | null
): StalenessStatus => {
  if (error)
    return {
      status: "error",
      color: "bg-red-600",
      text: "Error fetching data",
    };
  if (!lastUpdated)
    return { status: "unknown", color: "bg-gray-500", text: "No data" };

  const now = new Date();
  const updated = new Date(lastUpdated);
  const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / 60000);

  if (diffMinutes <= 1)
    return { status: "fresh", color: "bg-green-500", text: "Live" };
  if (diffMinutes <= 5)
    return { status: "recent", color: "bg-yellow-500", text: "Recent" };
  if (diffMinutes <= 15)
    return { status: "stale", color: "bg-orange-500", text: "Stale" };
  return { status: "very-stale", color: "bg-red-500", text: "Very stale" };
};

export const formatTime = (dateString: string | null): string | null => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
