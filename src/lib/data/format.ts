export function formatNumber(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0
  }).format(value);
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  if (isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value);
}
