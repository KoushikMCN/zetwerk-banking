export function formatMoney(amount: bigint): string {
  const rupees = amount / 100n;
  const paise = amount % 100n;

  return `${rupees}.${paise.toString().padStart(2, '0')}`;
}