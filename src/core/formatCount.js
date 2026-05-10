const formatter = new Intl.NumberFormat('ko-KR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCount(value) {
  if (!Number.isFinite(value)) return '0';
  return formatter.format(value);
}
