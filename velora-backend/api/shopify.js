const SHOP = process.env.SHOPIFY_SHOP;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  try {
    if (req.method === 'GET' && action === 'products') {
      return await getProducts(req, res);
    }
    if (req.method === 'PUT' && action === 'variant') {
      return await updateVariant(req, res);
    }
    if (req.method === 'PUT' && action === 'inventory') {
      return await updateInventory(req, res);
    }
    return res.status(404).json({ error: 'Acción no encontrada' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function shopifyFetch(endpoint, options = {}) {
  const url = `https://${SHOP}/admin/api/2024-01/${endpoint}`;
  const r = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
      ...(options.headers || {}),
    },
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Shopify error ${r.status}: ${err}`);
  }
  return r.json();
}

async function getProducts(req, res) {
  const data = await shopifyFetch('products.json?limit=250&fields=id,title,status,variants');
  const products = data.products.map(p => ({
    id: p.id,
    title: p.title,
    status: p.status,
    variants: p.variants.map(v => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      price: v.price,
      inventory_item_id: v.inventory_item_id,
      inventory_quantity: v.inventory_quantity,
    })),
  }));
  return res.status(200).json({ products });
}

async function updateVariant(req, res) {
  const { variant_id, price } = req.body;
  if (!variant_id) return res.status(400).json({ error: 'variant_id requerido' });

  const data = await shopifyFetch(`variants/${variant_id}.json`, {
    method: 'PUT',
    body: JSON.stringify({ variant: { id: variant_id, price } }),
  });
  return res.status(200).json({ variant: data.variant });
}

async function updateInventory(req, res) {
  const { inventory_item_id, available } = req.body;
  if (!inventory_item_id) return res.status(400).json({ error: 'inventory_item_id requerido' });

  const locData = await shopifyFetch(`inventory_levels.json?inventory_item_ids=${inventory_item_id}`);
  const location_id = locData.inventory_levels?.[0]?.location_id;
  if (!location_id) return res.status(400).json({ error: 'No se encontró location_id' });

  const data = await shopifyFetch('inventory_levels/set.json', {
    method: 'POST',
    body: JSON.stringify({ inventory_item_id, location_id, available }),
  });
  return res.status(200).json({ inventory_level: data.inventory_level });
}
