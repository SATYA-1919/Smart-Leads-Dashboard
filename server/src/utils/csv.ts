export interface CsvColumn<T> {
  label: string;
  value: (row: T) => string | number | Date | null | undefined;
}

function escapeField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = value instanceof Date ? value.toISOString() : String(value);
  // Quote fields that contain commas, quotes, newlines, or carriage returns.
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const header = columns.map((c) => escapeField(c.label)).join(',');
  if (rows.length === 0) return header;
  const body = rows
    .map((row) => columns.map((c) => escapeField(c.value(row))).join(','))
    .join('\r\n');
  return `${header}\r\n${body}`;
}
