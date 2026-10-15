// Match only the native delivery-time suffix, leaving method data untouched.
export function splitShippingName(text) {
  const match = text.match(/^(.*?)\s+(\(doručenie\s+[^()]+\))\s*$/iu);
  return match ? { name: match[1], delivery: match[2] } : null;
}
