/**
 * BigCommerce can provide URLs where a query param value contains raw reserved characters
 * (e.g. `product_name=Widget #2`, `product_name=AT&T`, `product_name=plus+sign`).
 *
 * These can be interpreted as URL delimiters:
 * - `#` fragment delimiter (truncates the query string)
 * - `&` query separator (splits into new params)
 * - `+` is treated as space in x-www-form-urlencoded semantics
 *
 * We sanitize values in-place so URL parsing retains the full intended value.
 */
export function sanitizeQueryParamValue(value: string): string {
  // Preserve valid percent-escapes, but encode stray '%' to avoid confusing URL parsing.
  const withSafePercents = value.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');

  // Encode characters that commonly break query parsing or semantics.
  return withSafePercents
    .replaceAll('+', '%2B') // URLSearchParams treats '+' as space
    .replaceAll('#', '%23') // fragment delimiter
    .replaceAll('&', '%26') // query separator
    .replaceAll(' ', '%20'); // avoid raw spaces
}

export function sanitizeQueryParamValueInPath(path: string, paramName: string): string {
  const key = `${paramName}=`;
  const keyIdx = path.indexOf(key);
  if (keyIdx === -1) return path;

  const valueStart = keyIdx + key.length;
  // Find the next *likely* query param delimiter: `&<key>=`.
  // This lets us keep unencoded `&` inside values like "AT&T" while still
  // respecting real delimiters for subsequent params.
  const remainder = path.slice(valueStart);
  const delimiterMatch = remainder.match(/&[A-Za-z0-9_.~-]+=/);
  const endIdx =
    delimiterMatch && typeof delimiterMatch.index === 'number'
      ? valueStart + delimiterMatch.index
      : path.length;

  const before = path.slice(0, valueStart);
  const value = path.slice(valueStart, endIdx);
  const after = path.slice(endIdx);

  return `${before}${sanitizeQueryParamValue(value)}${after}`;
}

