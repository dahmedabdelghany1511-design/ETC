/**
 * Enterprise Safe Formatting Utilities for ETC
 * Protects against runtime crashes: "Cannot read properties of undefined (reading 'toLocaleString')"
 */

export function formatNumber(
  val: number | string | null | undefined,
  fallback: number | string = 0
): string {
  if (val === null || val === undefined || val === "") {
    return String(fallback);
  }
  const num = typeof val === "number" ? val : Number(val);
  if (isNaN(num)) {
    return String(fallback);
  }
  return num.toLocaleString("ar-EG");
}

export function formatNumberEn(
  val: number | string | null | undefined,
  fallback: number | string = 0
): string {
  if (val === null || val === undefined || val === "") {
    return String(fallback);
  }
  const num = typeof val === "number" ? val : Number(val);
  if (isNaN(num)) {
    return String(fallback);
  }
  return num.toLocaleString();
}

export function formatCurrency(
  val: number | string | null | undefined,
  currency: string = "ج.م",
  fallback: string = "0"
): string {
  if (val === null || val === undefined || val === "") {
    return `${fallback} ${currency}`;
  }
  const num = typeof val === "number" ? val : Number(val);
  if (isNaN(num)) {
    return `${fallback} ${currency}`;
  }
  return `${num.toLocaleString()} ${currency}`;
}

export function formatDate(
  val: string | number | Date | null | undefined,
  fallback: string = "غير متوفر"
): string {
  if (!val) return fallback;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("ar-EG");
  } catch {
    return fallback;
  }
}

export function formatDateTime(
  val: string | number | Date | null | undefined,
  fallback: string = "غير متوفر"
): string {
  if (!val) return fallback;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleString("ar-EG");
  } catch {
    return fallback;
  }
}
