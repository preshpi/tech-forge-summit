export type CsvValue = string | number | null | undefined;

// Quote every cell, escape quotes, and neutralise spreadsheet formulas (CSV injection).
function cell(value: CsvValue) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: CsvValue[][]) {
  // The BOM makes Excel open the file as UTF-8 so names with accents display correctly.
  return '﻿' + [headers, ...rows].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}

// "2026-11-17 14:05:00" in West Africa Time — spreadsheet apps read this as a date.
export function watTimestamp(date: string) {
  return new Date(date).toLocaleString('sv-SE', { timeZone: 'Africa/Lagos', hour12: false });
}
