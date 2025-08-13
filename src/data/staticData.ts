// Static data for Vercel deployment - no file system access needed
export const staticProducts = [
  {
    id: "LAP001",
    tenantId: "tenant1",
    sku: "LAP001",
    name: "MacBook Pro 14\" M3 Pro",
    description: "Apple MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, 512GB SSD",
    price: 1999.99,
    cost: 1499.99,
    category: "Laptops",
    brand: "Apple",
    attributes: JSON.stringify({ color: "Space Gray", storage: "512GB", memory: "18GB", chip: "M3 Pro" }),
    isActive: true,
    createdAt: "2025-08-13T18:14:01.761Z",
    updatedAt: "2025-08-13T18:14:01.761Z"
  },
  {
    id: "LAP002",
    tenantId: "tenant1",
    sku: "LAP002",
    name: "Dell XPS 15",
    description: "Dell XPS 15 with Intel i9-13900H, 32GB RAM, 1TB SSD, RTX 4070",
    price: 2499.99,
    cost: 1874.99,
    category: "Laptops",
    brand: "Dell",
    attributes: JSON.stringify({ color: "Silver", storage: "1TB", memory: "32GB", gpu: "RTX 4070" }),
    isActive: true,
    createdAt: "2025-08-13T18:14:01.766Z",
    updatedAt: "2025-08-13T18:14:01.766Z"
  },
  {
    id: "PHN001",
    tenantId: "tenant1",
    sku: "PHN001",
    name: "iPhone 15 Pro Max",
    description: "Apple iPhone 15 Pro Max, 256GB, Natural Titanium, A17 Pro chip",
    price: 1199.99,
    cost: 899.99,
    category: "Smartphones",
    brand: "Apple",
    attributes: JSON.stringify({ color: "Natural Titanium", storage: "256GB", camera: "48MP", chip: "A17 Pro" }),
    isActive: true,
    createdAt: "2025-08-13T18:14:01.784Z",
    updatedAt: "2025-08-13T18:14:01.784Z"
  }
];

export const staticInventory = [
  {
    id: "INV001",
    tenantId: "tenant1",
    productId: "LAP001",
    quantity: 25,
    location: "Main Store",
    batchNumber: "BATCH001",
    reservedQuantity: 3,
    reorderPoint: 10,
    reorderQuantity: 50,
    lastRestocked: "2025-08-13T18:14:01.806Z"
  },
  {
    id: "INV002",
    tenantId: "tenant1",
    productId: "LAP002",
    quantity: 18,
    location: "Main Store",
    batchNumber: "BATCH002",
    reservedQuantity: 2,
    reorderPoint: 8,
    reorderQuantity: 40,
    lastRestocked: "2025-08-13T18:14:01.807Z"
  }
];

export const staticTenants = [
  {
    id: "TEN001",
    code: "tenant1",
    name: "Default Tenant",
    isActive: true,
    modules: "inventory,product,sales",
    createdAt: "2025-08-13T18:05:51.721Z",
    updatedAt: "2025-08-13T18:05:51.721Z"
  }
]; 