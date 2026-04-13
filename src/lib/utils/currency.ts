/**
 * All prices from the backend are in sen (integers).
 * 100 sen = RM 1.00. Never use floats.
 */

export function formatPrice(sen: number): string {
  const rm = sen / 100
  return `RM ${rm.toFixed(2)}`
}

export function formatPriceCompact(sen: number): string {
  return (sen / 100).toFixed(2)
}

export function senToRm(sen: number): number {
  return sen / 100
}

export function rmToSen(rm: number): number {
  return Math.round(rm * 100)
}

export function formatModifierPrice(sen: number): string {
  if (sen === 0) return ''
  return `+${formatPrice(sen)}`
}
