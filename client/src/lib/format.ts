export function formatPrice(price: number | string): string {
  const numeric = typeof price === 'number' ? price : Number(String(price).replace(/[^\d.-]/g, ''))
  if (Number.isNaN(numeric)) return String(price ?? '')
  return `${numeric.toLocaleString('en-US')} دج`
}
