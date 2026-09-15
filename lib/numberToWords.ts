// Converts a numeric Taka amount into words using the South-Asian
// (Lakh / Crore) grouping convention used on Bangladeshi bank cheques,
// e.g. 1250000 -> "Twelve Lakh Fifty Thousand"

const ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
  "Eighty", "Ninety",
];

function twoDigits(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const r = n % 10;
  return r ? `${TENS[t]} ${ONES[r]}` : TENS[t];
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} Hundred`);
  if (r) parts.push(twoDigits(r));
  return parts.join(" ");
}

/** Integer -> words using Crore / Lakh / Thousand / Hundred grouping. */
export function integerToWords(value: number): string {
  let n = Math.floor(Math.abs(value));
  if (n === 0) return "Zero";

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const rest = n;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (rest) parts.push(threeDigits(rest));

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Formats a Taka amount as cheque words, e.g.
 * amountToTakaWords(125050.50) ->
 *   "Taka One Lakh Twenty Five Thousand Fifty and 50 Paisa Only"
 */
export function amountToTakaWords(amount: number): string {
  if (!isFinite(amount) || amount < 0) return "";
  const rupees = Math.floor(amount);
  const paisa = Math.round((amount - rupees) * 100);

  let words = `Taka ${integerToWords(rupees)}`;
  if (paisa > 0) {
    words += ` and ${twoDigits(paisa)} Paisa`;
  }
  words += " Only";
  return words;
}

/** Formats a number with comma grouping using the South Asian (lakh/crore) style. */
export function formatAmountSouthAsian(amount: number): string {
  if (!isFinite(amount)) return "";
  const [intPart, decPart] = amount.toFixed(2).split(".");
  const negative = intPart.startsWith("-");
  const digits = negative ? intPart.slice(1) : intPart;

  let formatted: string;
  if (digits.length <= 3) {
    formatted = digits;
  } else {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    const groups = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    formatted = `${groups},${last3}`;
  }
  return `${negative ? "-" : ""}${formatted}.${decPart}`;
}
