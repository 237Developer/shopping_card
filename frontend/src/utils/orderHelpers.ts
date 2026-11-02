export function formatOrderDate(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculatePageNumbers(currentPage: number, totalPages: number): number[] {
  const pages = [];
  let start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}
