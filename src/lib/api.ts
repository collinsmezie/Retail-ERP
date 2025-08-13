export async function getInventory() {
  console.log('API: getInventory called');
  try {
    const url = `/api/inventory?_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    console.log('API: getInventory response status', res.status);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    const data = await res.json();
    console.log('API: getInventory data', data);
    return data;
  } catch (err) {
    console.error('API: getInventory error', err);
    throw err;
  }
}

export async function stockIn(data: any) {
  console.log('API: stockIn called', data);
  try {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'stockIn', ...data }),
    });
    console.log('API: stockIn response status', res.status);
    if (!res.ok) throw new Error('Failed to stock in');
    const result = await res.json();
    console.log('API: stockIn result', result);
    return result;
  } catch (err) {
    console.error('API: stockIn error', err);
    throw err;
  }
}

export async function stockOut(data: any) {
  console.log('API: stockOut called', data);
  try {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'stockOut', ...data }),
    });
    console.log('API: stockOut response status', res.status);
    if (!res.ok) throw new Error('Failed to stock out');
    const result = await res.json();
    console.log('API: stockOut result', result);
    return result;
  } catch (err) {
    console.error('API: stockOut error', err);
    throw err;
  }
}

export async function adjustStock(data: any) {
  console.log('API: adjustStock called', data);
  try {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'adjustStock', ...data }),
    });
    console.log('API: adjustStock response status', res.status);
    if (!res.ok) throw new Error('Failed to adjust stock');
    const result = await res.json();
    console.log('API: adjustStock result', result);
    return result;
  } catch (err) {
    console.error('API: adjustStock error', err);
    throw err;
  }
}

export async function getProducts() {
  console.log('API: getProducts called');
  try {
    const res = await fetch('/api/products');
    console.log('API: getProducts response status', res.status);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    console.log('API: getProducts data', data);
    return data;
  } catch (err) {
    console.error('API: getProducts error', err);
    throw err;
  }
}

export async function createProduct(data: any) {
  console.log('API: createProduct called', data);
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log('API: createProduct response status', res.status);
    if (!res.ok) throw new Error('Failed to create product');
    const result = await res.json();
    console.log('API: createProduct result', result);
    return result;
  } catch (err) {
    console.error('API: createProduct error', err);
    throw err;
  }
} 