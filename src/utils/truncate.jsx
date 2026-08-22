export default function truncateTitle(title, maxLength = 14) {
  let result = title;

  if (title.length > maxLength) {
    result = title.slice(0, maxLength) + "...";
  }

  result = result.toLowerCase();
  return result.charAt(0).toUpperCase() + result.slice(1);
}
