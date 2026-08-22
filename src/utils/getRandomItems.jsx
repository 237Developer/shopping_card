export default function getRandomItems(arr, count) {
  if (!arr) return null;
  // Copy the array to avoid changing the order of the received array.
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
