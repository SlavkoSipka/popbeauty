/** Zarada kreatora po jednoj porudžbini (RSD), na osnovu snapshot provizije. */
export function commissionEarnedRsd(
  totalRsd: number,
  commissionPercentApplied: number | string | null | undefined
): number {
  if (
    commissionPercentApplied === null ||
    commissionPercentApplied === undefined ||
    commissionPercentApplied === ''
  ) {
    return 0;
  }
  const pct = Number(commissionPercentApplied);
  if (Number.isNaN(pct)) return 0;
  return Math.round(((totalRsd * pct) / 100) * 100) / 100;
}
