// utils/seasonDetector.js
export function getSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  // Northern Hemisphere seasons
  if (month >= 2 && month <= 4) return "spring"; // Mar, Apr, May
  if (month >= 5 && month <= 7) return "summer"; // Jun, Jul, Aug
  if (month >= 8 && month <= 10) return "fall";   // Sep, Oct, Nov
  return "winter"; // Dec, Jan, Feb
}
