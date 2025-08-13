import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findUnique({ where: { code: 'tenant1' } });
  if (!tenant) throw new Error('tenant1 not found. Run seed.ts first.');

  const products = [
    { sku: 'GPF-001', name: 'Golden Penny Flour', price: 8500, cost: 7000, category: 'Groceries', brand: 'Golden Penny' },
    { sku: 'DS-002', name: 'Dangote Sugar', price: 4500, cost: 3800, category: 'Groceries', brand: 'Dangote' },
    { sku: 'PM-003', name: 'Peak Milk (Tin)', price: 900, cost: 750, category: 'Dairy', brand: 'Peak' },
    { sku: 'RI-004', name: 'Royal Stallion Rice 25kg', price: 35500, cost: 32000, category: 'Groceries', brand: 'Royal Stallion' },
    { sku: 'OL-005', name: 'Devon King\'s Oil 1L', price: 3800, cost: 3200, category: 'Groceries', brand: 'Devon King' },
    // Additional items
    { sku: 'BM-006', name: 'Bournvita 500g', price: 2100, cost: 1800, category: 'Beverages', brand: 'Cadbury' },
    { sku: 'CO-007', name: 'Coca-Cola 50cl', price: 350, cost: 250, category: 'Beverages', brand: 'Coca-Cola' },
    { sku: 'TE-008', name: 'Lipton Tea 100 Bags', price: 2300, cost: 1900, category: 'Beverages', brand: 'Lipton' },
    { sku: 'BR-009', name: 'Butter Bread Loaf', price: 1200, cost: 900, category: 'Bakery', brand: 'Daily Fresh' },
    { sku: 'SP-010', name: 'Spaghetti 500g', price: 900, cost: 700, category: 'Groceries', brand: 'Golden Penny' },
    { sku: 'WC-011', name: 'Washing Soap 1pc', price: 400, cost: 250, category: 'Household', brand: 'Sunlight' },
    { sku: 'TB-012', name: 'Toothbrush Medium', price: 600, cost: 400, category: 'Toiletries', brand: 'OralCare' },
    { sku: 'SD-013', name: 'Sanitary Pads (10s)', price: 1500, cost: 1100, category: 'Toiletries', brand: 'Always' },
    { sku: 'EG-014', name: 'Eggs (Crate of 30)', price: 3600, cost: 3000, category: 'Groceries', brand: 'Farm Fresh' },
    { sku: 'OR-015', name: 'Orange Juice 1L', price: 1800, cost: 1400, category: 'Beverages', brand: 'FiveAlive' },
    // 15 more products for overflow testing
    { sku: 'CH-016', name: 'Chocolate Bar 100g', price: 800, cost: 600, category: 'Snacks', brand: 'Cadbury' },
    { sku: 'CR-017', name: 'Crackers 200g', price: 650, cost: 450, category: 'Snacks', brand: 'Crown' },
    { sku: 'NT-018', name: 'Peanuts 500g', price: 1200, cost: 900, category: 'Snacks', brand: 'Nutty' },
    { sku: 'IC-019', name: 'Ice Cream Vanilla', price: 1500, cost: 1200, category: 'Dairy', brand: 'Cold Stone' },
    { sku: 'YR-020', name: 'Yoghurt Natural 500g', price: 1800, cost: 1400, category: 'Dairy', brand: 'Danone' },
    { sku: 'CH-021', name: 'Cheese Slices 200g', price: 2200, cost: 1800, category: 'Dairy', brand: 'Laughing Cow' },
    { sku: 'BT-022', name: 'Butter 250g', price: 2800, cost: 2200, category: 'Dairy', brand: 'Anchor' },
    { sku: 'ML-023', name: 'Milk Powder 1kg', price: 4500, cost: 3800, category: 'Dairy', brand: 'Nido' },
    { sku: 'CR-024', name: 'Cream 200ml', price: 1200, cost: 900, category: 'Dairy', brand: 'Nestle' },
    { sku: 'SH-025', name: 'Shampoo 400ml', price: 2800, cost: 2200, category: 'Toiletries', brand: 'Head & Shoulders' },
    { sku: 'CP-026', name: 'Conditioner 400ml', price: 2600, cost: 2000, category: 'Toiletries', brand: 'Pantene' },
    { sku: 'TB-027', name: 'Toothpaste 200g', price: 1800, cost: 1400, category: 'Toiletries', brand: 'Colgate' },
    { sku: 'DP-028', name: 'Deodorant 150ml', price: 2200, cost: 1800, category: 'Toiletries', brand: 'Nivea' },
    { sku: 'SP-029', name: 'Soap Bar 100g', price: 300, cost: 200, category: 'Toiletries', brand: 'Dove' },
    { sku: 'TP-030', name: 'Toilet Paper 12 Rolls', price: 2500, cost: 2000, category: 'Household', brand: 'Soft' },
  ];

  const inventorySeed = [
    { sku: 'GPF-001', quantity: 12, reorderPoint: 10, reorderQuantity: 20, location: 'Main Store' }, // In Stock
    { sku: 'DS-002', quantity: 4, reorderPoint: 10, reorderQuantity: 20, location: 'Warehouse A' },  // Low Stock
    { sku: 'PM-003', quantity: 0, reorderPoint: 5, reorderQuantity: 10, location: 'Main Store' },    // Out of Stock
    { sku: 'RI-004', quantity: 7, reorderPoint: 6, reorderQuantity: 12, location: 'Warehouse B' },   // In Stock (near threshold)
    { sku: 'OL-005', quantity: 18, reorderPoint: 8, reorderQuantity: 16, location: 'Main Store' },   // Healthy
    // Additional inventory
    { sku: 'BM-006', quantity: 15, reorderPoint: 6, reorderQuantity: 12, location: 'Main Store' },
    { sku: 'CO-007', quantity: 60, reorderPoint: 30, reorderQuantity: 100, location: 'Chiller A' },
    { sku: 'TE-008', quantity: 22, reorderPoint: 10, reorderQuantity: 20, location: 'Main Store' },
    { sku: 'BR-009', quantity: 8, reorderPoint: 10, reorderQuantity: 20, location: 'Bakery' },
    { sku: 'SP-010', quantity: 25, reorderPoint: 12, reorderQuantity: 24, location: 'Warehouse B' },
    { sku: 'WC-011', quantity: 40, reorderPoint: 20, reorderQuantity: 60, location: 'Main Store' },
    { sku: 'TB-012', quantity: 35, reorderPoint: 15, reorderQuantity: 40, location: 'Main Store' },
    { sku: 'SD-013', quantity: 5, reorderPoint: 8, reorderQuantity: 16, location: 'Main Store' },
    { sku: 'EG-014', quantity: 3, reorderPoint: 5, reorderQuantity: 10, location: 'Cold Room' },
    { sku: 'OR-015', quantity: 14, reorderPoint: 10, reorderQuantity: 20, location: 'Chiller B' },
    // 15 more inventory configurations
    { sku: 'CH-016', quantity: 28, reorderPoint: 15, reorderQuantity: 30, location: 'Main Store' },
    { sku: 'CR-017', quantity: 42, reorderPoint: 20, reorderQuantity: 50, location: 'Main Store' },
    { sku: 'NT-018', quantity: 16, reorderPoint: 10, reorderQuantity: 25, location: 'Main Store' },
    { sku: 'IC-019', quantity: 0, reorderPoint: 8, reorderQuantity: 20, location: 'Freezer A' },
    { sku: 'YR-020', quantity: 9, reorderPoint: 12, reorderQuantity: 24, location: 'Chiller A' },
    { sku: 'CH-021', quantity: 33, reorderPoint: 15, reorderQuantity: 30, location: 'Chiller B' },
    { sku: 'BT-022', quantity: 11, reorderPoint: 8, reorderQuantity: 16, location: 'Chiller B' },
    { sku: 'ML-023', quantity: 19, reorderPoint: 10, reorderQuantity: 20, location: 'Main Store' },
    { sku: 'CR-024', quantity: 7, reorderPoint: 8, reorderQuantity: 16, location: 'Chiller A' },
    { sku: 'SH-025', quantity: 26, reorderPoint: 12, reorderQuantity: 25, location: 'Main Store' },
    { sku: 'CP-026', quantity: 31, reorderPoint: 15, reorderQuantity: 30, location: 'Main Store' },
    { sku: 'TB-027', quantity: 44, reorderPoint: 20, reorderQuantity: 50, location: 'Main Store' },
    { sku: 'DP-028', quantity: 13, reorderPoint: 10, reorderQuantity: 20, location: 'Main Store' },
    { sku: 'SP-029', quantity: 38, reorderPoint: 18, reorderQuantity: 40, location: 'Main Store' },
    { sku: 'TP-030', quantity: 22, reorderPoint: 12, reorderQuantity: 24, location: 'Warehouse A' },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { tenantId_sku: { tenantId: tenant.id, sku: p.sku } },
      update: {
        name: p.name,
        price: p.price,
        cost: p.cost,
        category: p.category,
        brand: p.brand,
        isActive: true,
      },
      create: {
        tenantId: tenant.id,
        sku: p.sku,
        name: p.name,
        description: `${p.name} - seeded item`,
        price: p.price,
        cost: p.cost,
        category: p.category,
        brand: p.brand,
        attributes: '{}',
        isActive: true,
      },
    });

    const invCfg = inventorySeed.find(i => i.sku === p.sku)!;
    await prisma.inventory.upsert({
      where: { tenantId_productId: { tenantId: tenant.id, productId: product.id } },
      update: {
        quantity: invCfg.quantity,
        reservedQuantity: 0,
        reorderPoint: invCfg.reorderPoint,
        reorderQuantity: invCfg.reorderQuantity,
        location: invCfg.location,
        lastRestocked: new Date(),
      },
      create: {
        tenantId: tenant.id,
        productId: product.id,
        quantity: invCfg.quantity,
        reservedQuantity: 0,
        reorderPoint: invCfg.reorderPoint,
        reorderQuantity: invCfg.reorderQuantity,
        location: invCfg.location,
        lastRestocked: new Date(),
      },
    });
  }

  const count = await prisma.inventory.count({ where: { tenantId: tenant.id } });
  console.log(`Seeded inventory records for tenant1. Inventory count: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 