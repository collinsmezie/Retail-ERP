import { jsonRepository } from './repository';
import { generateId, generateTimestamp } from './models';
import { logger } from './logger';

export async function seedData(): Promise<void> {
  try {
    logger.info('Starting data seeding...');

    // Create sample products
    const products = [
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'LAP001',
        name: 'MacBook Pro 13"',
        description: 'Apple MacBook Pro 13-inch with M2 chip',
        price: 1299.99,
        cost: 999.99,
        category: 'Electronics',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'Space Gray', storage: '256GB', memory: '8GB' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'LAP002',
        name: 'Dell XPS 13',
        description: 'Dell XPS 13 Ultrabook with Intel i7',
        price: 1199.99,
        cost: 899.99,
        category: 'Electronics',
        brand: 'Dell',
        attributes: JSON.stringify({ color: 'Silver', storage: '512GB', memory: '16GB' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'PHN001',
        name: 'iPhone 15 Pro',
        description: 'Apple iPhone 15 Pro with A17 Pro chip',
        price: 999.99,
        cost: 749.99,
        category: 'Electronics',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'Natural Titanium', storage: '128GB', camera: '48MP' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'PHN002',
        name: 'Samsung Galaxy S24',
        description: 'Samsung Galaxy S24 with Snapdragon 8 Gen 3',
        price: 899.99,
        cost: 674.99,
        category: 'Electronics',
        brand: 'Samsung',
        attributes: JSON.stringify({ color: 'Onyx Black', storage: '256GB', camera: '50MP' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'TAB001',
        name: 'iPad Air',
        description: 'Apple iPad Air with M1 chip',
        price: 599.99,
        cost: 449.99,
        category: 'Electronics',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'Space Gray', storage: '64GB', size: '10.9"' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC001',
        name: 'AirPods Pro',
        description: 'Apple AirPods Pro with Active Noise Cancellation',
        price: 249.99,
        cost: 187.49,
        category: 'Accessories',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'White', connectivity: 'Bluetooth 5.0', waterproof: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC002',
        name: 'Samsung Galaxy Buds2',
        description: 'Samsung Galaxy Buds2 Wireless Earbuds',
        price: 149.99,
        cost: 112.49,
        category: 'Accessories',
        brand: 'Samsung',
        attributes: JSON.stringify({ color: 'Graphite', connectivity: 'Bluetooth 5.2', waterproof: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'CAB001',
        name: 'USB-C Cable',
        description: 'High-speed USB-C to USB-C cable',
        price: 19.99,
        cost: 9.99,
        category: 'Accessories',
        brand: 'Generic',
        attributes: JSON.stringify({ length: '1m', speed: '10Gbps', power: '100W' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'CAB002',
        name: 'Lightning Cable',
        description: 'Apple Lightning to USB-C cable',
        price: 19.99,
        cost: 9.99,
        category: 'Accessories',
        brand: 'Apple',
        attributes: JSON.stringify({ length: '1m', speed: '480Mbps', power: '12W' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'CHG001',
        name: 'Wireless Charger',
        description: '15W Fast Wireless Charging Pad',
        price: 39.99,
        cost: 29.99,
        category: 'Accessories',
        brand: 'Generic',
        attributes: JSON.stringify({ power: '15W', compatibility: 'Qi', led: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      }
    ];

    // Create sample inventories
    const inventories = [
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[0].id,
        quantity: 25,
        location: 'Main Store',
        batchNumber: 'BATCH001',
        reservedQuantity: 5,
        reorderPoint: 10,
        reorderQuantity: 50,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[1].id,
        quantity: 18,
        location: 'Main Store',
        batchNumber: 'BATCH002',
        reservedQuantity: 3,
        reorderPoint: 8,
        reorderQuantity: 40,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[2].id,
        quantity: 45,
        location: 'Main Store',
        batchNumber: 'BATCH003',
        reservedQuantity: 8,
        reorderPoint: 15,
        reorderQuantity: 100,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[3].id,
        quantity: 32,
        location: 'Main Store',
        batchNumber: 'BATCH004',
        reservedQuantity: 6,
        reorderPoint: 12,
        reorderQuantity: 80,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[4].id,
        quantity: 28,
        location: 'Main Store',
        batchNumber: 'BATCH005',
        reservedQuantity: 4,
        reorderPoint: 10,
        reorderQuantity: 60,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[5].id,
        quantity: 60,
        location: 'Main Store',
        batchNumber: 'BATCH006',
        reservedQuantity: 10,
        reorderPoint: 20,
        reorderQuantity: 120,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[6].id,
        quantity: 40,
        location: 'Main Store',
        batchNumber: 'BATCH007',
        reservedQuantity: 7,
        reorderPoint: 15,
        reorderQuantity: 80,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[7].id,
        quantity: 100,
        location: 'Main Store',
        batchNumber: 'BATCH008',
        reservedQuantity: 15,
        reorderPoint: 30,
        reorderQuantity: 200,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[8].id,
        quantity: 85,
        location: 'Main Store',
        batchNumber: 'BATCH009',
        reservedQuantity: 12,
        reorderPoint: 25,
        reorderQuantity: 150,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        productId: products[9].id,
        quantity: 35,
        location: 'Main Store',
        batchNumber: 'BATCH010',
        reservedQuantity: 6,
        reorderPoint: 12,
        reorderQuantity: 70,
        lastRestocked: generateTimestamp(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      }
    ];

    // Add products to repository
    for (const product of products) {
      await jsonRepository.create('products', {
        tenantId: product.tenantId,
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        category: product.category,
        brand: product.brand,
        attributes: product.attributes,
        isActive: product.isActive
      });
    }

    // Add inventories to repository
    for (const inventory of inventories) {
      await jsonRepository.create('inventories', {
        tenantId: inventory.tenantId,
        productId: inventory.productId,
        quantity: inventory.quantity,
        location: inventory.location,
        batchNumber: inventory.batchNumber,
        reservedQuantity: inventory.reservedQuantity,
        reorderPoint: inventory.reorderPoint,
        reorderQuantity: inventory.reorderQuantity,
        lastRestocked: inventory.lastRestocked
      });
    }

    logger.info('Data seeding completed successfully');
    logger.info(`Created ${products.length} products and ${inventories.length} inventory records`);
  } catch (error) {
    logger.error('Data seeding failed', { error });
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData().catch(console.error);
} 