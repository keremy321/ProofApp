export function formattedUnixTimestamp(timestamp) {
    if (!timestamp) return "Unknown";

    const date = new Date(Number(timestamp) * 1000);

    return date.toLocaleString();
}