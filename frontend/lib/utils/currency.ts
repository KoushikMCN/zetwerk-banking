export function formatCurrency(
  amount: string,
  currency: string,
): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}