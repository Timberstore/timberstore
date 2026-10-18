// Tracking priceId keys and SKU content_ids are different identifiers.
export function detailIdentity(product, priceId, tracking, unit = null) {
  if (!product?.id || !product.guid) return null;
  const codes = (product.codes || []).map((item) => String(item.code));
  let code;
  if (!product.hasVariants && codes.length === 1) code = codes[0];
  else {
    if (!priceId || priceId === '0') return null;
    const tracked = tracking?.[priceId];
    if (String(tracked?.base_id) === String(product.id) && tracked.content_ids?.length === 1) {
      const candidate = String(tracked.content_ids[0]);
      if (codes.includes(candidate)) code = candidate;
    }
  }
  return code ? { productId: String(product.id), guid: product.guid, code, unit } : null;
}
export function cardIdentity(productId, guid, code, unit = null) {
  if (!/^\d+$/.test(productId || '') || !/^[a-f\d-]{36}$/i.test(guid || '') || !code?.trim())
    return null;
  return { productId, guid, code: code.trim(), unit };
}
