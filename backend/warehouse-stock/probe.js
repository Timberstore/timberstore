// Run on the configured private server; prints only warehouse/stock fields.
import { createShoptetRequest } from './provider.js';
const request = createShoptetRequest({
  accessToken: process.env.SHOPTET_ACCESS_TOKEN,
  privateToken: process.env.SHOPTET_PRIVATE_API_TOKEN,
});
const shop = await request('/api/eshop');
const eshopId = shop.data?.contactInformation?.eshopId;
if (eshopId !== 765909) throw new Error('Token is not bound to TimberStore 765909');
console.log(JSON.stringify({ eshopId }));
const stocks = await request('/api/stocks');
console.log(
  JSON.stringify(
    {
      stocks: stocks.data?.stocks?.map(({ id, title, visibleOnEshop }) => ({
        id,
        title,
        visibleOnEshop,
      })),
    },
    null,
    2,
  ),
);
const guid = process.argv[2];
if (guid) {
  if (!/^[a-f0-9-]{36}$/i.test(guid)) throw new Error('Invalid GUID');
  const product = await request(`/api/products/${guid}?include=perStockAmounts`);
  console.log(
    JSON.stringify(
      {
        guid: product.data?.guid,
        variants: product.data?.variants?.map(({ code, unit, perStockAmounts }) => ({
          code,
          unit,
          perStockAmounts,
        })),
      },
      null,
      2,
    ),
  );
}
