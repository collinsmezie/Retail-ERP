import { NextRequest, NextResponse } from 'next/server';
import { jsonRepository } from '@/lib/repository';
import { generateId, generateTimestamp } from '@/lib/models';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  return await POST(request);
}

export async function POST(request: NextRequest) {
  try {
    logger.info('Starting data seeding via API...');

    // Create 30 comprehensive electronics shop products
    const products = [
      // Laptops & Computers
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'LAP001',
        name: 'MacBook Pro 14" M3 Pro',
        description: 'Apple MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, 512GB SSD',
        price: 1999.99,
        cost: 1499.99,
        category: 'Laptops',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'Space Gray', storage: '512GB', memory: '18GB', chip: 'M3 Pro' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'LAP002',
        name: 'Dell XPS 15',
        description: 'Dell XPS 15 with Intel i9-13900H, 32GB RAM, 1TB SSD, RTX 4070',
        price: 2499.99,
        cost: 1874.99,
        category: 'Laptops',
        brand: 'Dell',
        attributes: JSON.stringify({ color: 'Silver', storage: '1TB', memory: '32GB', gpu: 'RTX 4070' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'LAP003',
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Lenovo ThinkPad X1 Carbon Gen 11, Intel i7, 16GB RAM, 512GB SSD',
        price: 1899.99,
        cost: 1424.99,
        category: 'Laptops',
        brand: 'Lenovo',
        attributes: JSON.stringify({ color: 'Black', storage: '512GB', memory: '16GB', weight: '1.12kg' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'LAP004',
        name: 'ASUS ROG Strix G16',
        description: 'ASUS ROG Strix G16 Gaming Laptop, Intel i7, 16GB RAM, RTX 4060',
        price: 1299.99,
        cost: 974.99,
        category: 'Gaming Laptops',
        brand: 'ASUS',
        attributes: JSON.stringify({ color: 'Black', storage: '512GB', memory: '16GB', gpu: 'RTX 4060' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'LAP005',
        name: 'HP Spectre x360',
        description: 'HP Spectre x360 2-in-1, Intel i7, 16GB RAM, 1TB SSD, Touch Screen',
        price: 1599.99,
        cost: 1199.99,
        category: '2-in-1 Laptops',
        brand: 'HP',
        attributes: JSON.stringify({ color: 'Nightfall Black', storage: '1TB', memory: '16GB', touch: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },

      // Smartphones
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'PHN001',
        name: 'iPhone 15 Pro Max',
        description: 'Apple iPhone 15 Pro Max, 256GB, Natural Titanium, A17 Pro chip',
        price: 1199.99,
        cost: 899.99,
        category: 'Smartphones',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'Natural Titanium', storage: '256GB', camera: '48MP', chip: 'A17 Pro' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'PHN002',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung Galaxy S24 Ultra, 512GB, Titanium Gray, Snapdragon 8 Gen 3',
        price: 1299.99,
        cost: 974.99,
        category: 'Smartphones',
        brand: 'Samsung',
        attributes: JSON.stringify({ color: 'Titanium Gray', storage: '512GB', camera: '200MP', chip: 'Snapdragon 8 Gen 3' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'PHN003',
        name: 'Google Pixel 8 Pro',
        description: 'Google Pixel 8 Pro, 256GB, Obsidian, Google Tensor G3',
        price: 999.99,
        cost: 749.99,
        category: 'Smartphones',
        brand: 'Google',
        attributes: JSON.stringify({ color: 'Obsidian', storage: '256GB', camera: '50MP', chip: 'Tensor G3' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'PHN004',
        name: 'OnePlus 12',
        description: 'OnePlus 12, 256GB, Flowy Emerald, Snapdragon 8 Gen 3',
        price: 799.99,
        cost: 599.99,
        category: 'Smartphones',
        brand: 'OnePlus',
        attributes: JSON.stringify({ color: 'Flowy Emerald', storage: '256GB', camera: '50MP', chip: 'Snapdragon 8 Gen 3' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'PHN005',
        name: 'Xiaomi 14 Ultra',
        description: 'Xiaomi 14 Ultra, 512GB, Black, Snapdragon 8 Gen 3',
        price: 899.99,
        cost: 674.99,
        category: 'Smartphones',
        brand: 'Xiaomi',
        attributes: JSON.stringify({ color: 'Black', storage: '512GB', camera: '50MP', chip: 'Snapdragon 8 Gen 3' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },

      // Tablets
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'TAB001',
        name: 'iPad Pro 12.9" M4',
        description: 'Apple iPad Pro 12.9-inch with M4 chip, 256GB, Wi-Fi + Cellular',
        price: 1199.99,
        cost: 899.99,
        category: 'Tablets',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'Space Gray', storage: '256GB', size: '12.9"', chip: 'M4' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'TAB002',
        name: 'Samsung Galaxy Tab S9 Ultra',
        description: 'Samsung Galaxy Tab S9 Ultra, 14.6", 256GB, Wi-Fi, Snapdragon 8 Gen 2',
        price: 999.99,
        cost: 749.99,
        category: 'Tablets',
        brand: 'Samsung',
        attributes: JSON.stringify({ color: 'Graphite', storage: '256GB', size: '14.6"', chip: 'Snapdragon 8 Gen 2' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'TAB003',
        name: 'Microsoft Surface Pro 9',
        description: 'Microsoft Surface Pro 9, Intel i7, 16GB RAM, 256GB SSD',
        price: 1499.99,
        cost: 1124.99,
        category: 'Tablets',
        brand: 'Microsoft',
        attributes: JSON.stringify({ color: 'Platinum', storage: '256GB', memory: '16GB', os: 'Windows 11' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },

      // Audio & Headphones
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'AUD001',
        name: 'Sony WH-1000XM5',
        description: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        price: 399.99,
        cost: 299.99,
        category: 'Headphones',
        brand: 'Sony',
        attributes: JSON.stringify({ color: 'Black', connectivity: 'Bluetooth 5.2', anc: true, battery: '30h' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'AUD002',
        name: 'Bose QuietComfort 45',
        description: 'Bose QuietComfort 45 Wireless Noise Canceling Headphones',
        price: 329.99,
        cost: 247.49,
        category: 'Headphones',
        brand: 'Bose',
        attributes: JSON.stringify({ color: 'Black', connectivity: 'Bluetooth 5.1', anc: true, battery: '24h' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'AUD003',
        name: 'AirPods Pro 2nd Gen',
        description: 'Apple AirPods Pro 2nd Generation with Active Noise Cancellation',
        price: 249.99,
        cost: 187.49,
        category: 'Earbuds',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'White', connectivity: 'Bluetooth 5.0', anc: true, waterproof: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'AUD004',
        name: 'Samsung Galaxy Buds2 Pro',
        description: 'Samsung Galaxy Buds2 Pro Wireless Earbuds with Active Noise Cancellation',
        price: 229.99,
        cost: 172.49,
        category: 'Earbuds',
        brand: 'Samsung',
        attributes: JSON.stringify({ color: 'Graphite', connectivity: 'Bluetooth 5.3', anc: true, waterproof: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },

      // Gaming
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'GAM001',
        name: 'PlayStation 5 Digital Edition',
        description: 'Sony PlayStation 5 Digital Edition Console, 825GB SSD',
        price: 399.99,
        cost: 299.99,
        category: 'Gaming Consoles',
        brand: 'Sony',
        attributes: JSON.stringify({ color: 'White', storage: '825GB', type: 'Digital', generation: '9th' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'GAM002',
        name: 'Xbox Series X',
        description: 'Microsoft Xbox Series X Console, 1TB SSD, 4K Gaming',
        price: 499.99,
        cost: 374.99,
        category: 'Gaming Consoles',
        brand: 'Microsoft',
        attributes: JSON.stringify({ color: 'Black', storage: '1TB', resolution: '4K', generation: '9th' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'GAM003',
        name: 'Nintendo Switch OLED',
        description: 'Nintendo Switch OLED Model, 64GB, White Joy-Con Controllers',
        price: 349.99,
        cost: 262.49,
        category: 'Gaming Consoles',
        brand: 'Nintendo',
        attributes: JSON.stringify({ color: 'White', storage: '64GB', screen: 'OLED', type: 'Hybrid' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'GAM004',
        name: 'Steam Deck OLED',
        description: 'Valve Steam Deck OLED, 1TB, 7.4" OLED Display',
        price: 549.99,
        cost: 412.49,
        category: 'Gaming Handhelds',
        brand: 'Valve',
        attributes: JSON.stringify({ color: 'Black', storage: '1TB', screen: '7.4" OLED', os: 'SteamOS' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },

      // Smart Home & IoT
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'IOT001',
        name: 'Amazon Echo Dot 5th Gen',
        description: 'Amazon Echo Dot 5th Generation Smart Speaker with Alexa',
        price: 49.99,
        cost: 37.49,
        category: 'Smart Home',
        brand: 'Amazon',
        attributes: JSON.stringify({ color: 'Charcoal', connectivity: 'Wi-Fi', assistant: 'Alexa', speaker: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'IOT002',
        name: 'Google Nest Hub 2nd Gen',
        description: 'Google Nest Hub 2nd Generation Smart Display with Google Assistant',
        price: 99.99,
        cost: 74.99,
        category: 'Smart Home',
        brand: 'Google',
        attributes: JSON.stringify({ color: 'Chalk', connectivity: 'Wi-Fi', assistant: 'Google', display: '7"' }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'IOT003',
        name: 'Philips Hue White & Color Ambiance Starter Kit',
        description: 'Philips Hue White & Color Ambiance Smart Bulb Starter Kit, 3 Bulbs + Bridge',
        price: 199.99,
        cost: 149.99,
        category: 'Smart Home',
        brand: 'Philips',
        attributes: JSON.stringify({ color: 'White', connectivity: 'Zigbee', bulbs: 3, bridge: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },

      // Accessories & Cables
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC001',
        name: 'Anker PowerCore 26800mAh',
        description: 'Anker PowerCore 26800mAh Portable Charger with Power Delivery',
        price: 79.99,
        cost: 59.99,
        category: 'Power Banks',
        brand: 'Anker',
        attributes: JSON.stringify({ capacity: '26800mAh', output: '18W', ports: 3, pd: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC002',
        name: 'Belkin Boost Charge Pro 3-in-1',
        description: 'Belkin Boost Charge Pro 3-in-1 Wireless Charging Pad for iPhone, AirPods, Apple Watch',
        price: 149.99,
        cost: 112.49,
        category: 'Wireless Chargers',
        brand: 'Belkin',
        attributes: JSON.stringify({ power: '15W', compatibility: 'Qi', ports: 3, fast: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC003',
        name: 'Samsung 65W USB-C Charger',
        description: 'Samsung 65W USB-C Fast Charging Adapter with PPS Technology',
        price: 39.99,
        cost: 29.99,
        category: 'Chargers',
        brand: 'Samsung',
        attributes: JSON.stringify({ power: '65W', type: 'USB-C', pps: true, foldable: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC004',
        name: 'Apple MagSafe Charger',
        description: 'Apple MagSafe Charger for iPhone 12 and later, 15W charging',
        price: 39.99,
        cost: 29.99,
        category: 'Wireless Chargers',
        brand: 'Apple',
        attributes: JSON.stringify({ power: '15W', type: 'MagSafe', compatibility: 'iPhone 12+', magnetic: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC005',
        name: 'Logitech MX Master 3S',
        description: 'Logitech MX Master 3S Wireless Mouse, 8000 DPI, Silent Clicks',
        price: 99.99,
        cost: 74.99,
        category: 'Computer Accessories',
        brand: 'Logitech',
        attributes: JSON.stringify({ color: 'Pale Gray', connectivity: 'Bluetooth/2.4GHz', dpi: '8000', silent: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      {
        id: generateId(),
        tenantId: 'tenant1',
        sku: 'ACC006',
        name: 'Apple Magic Keyboard',
        description: 'Apple Magic Keyboard with Numeric Keypad, Wireless, Rechargeable',
        price: 129.99,
        cost: 97.49,
        category: 'Computer Accessories',
        brand: 'Apple',
        attributes: JSON.stringify({ color: 'White', connectivity: 'Bluetooth', layout: 'Full-size', rechargeable: true }),
        isActive: true,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      }
    ];

    // Create comprehensive inventory records for all products
    const inventories = products.map((product, index) => ({
      id: generateId(),
      tenantId: 'tenant1',
      productId: product.id,
      quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
      location: 'Main Store',
      batchNumber: `BATCH${String(index + 1).padStart(3, '0')}`,
      reservedQuantity: Math.floor(Math.random() * 5) + 1, // Random reserved between 1-6
      reorderPoint: Math.floor(Math.random() * 15) + 5, // Random reorder point between 5-20
      reorderQuantity: Math.floor(Math.random() * 100) + 50, // Random reorder quantity between 50-150
      lastRestocked: generateTimestamp(),
      createdAt: generateTimestamp(),
      updatedAt: generateTimestamp()
    }));

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

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${products.length} products and ${inventories.length} inventory records`,
      productsCount: products.length,
      inventoriesCount: inventories.length
    });

  } catch (error) {
    logger.error('Data seeding failed', { error });
    return NextResponse.json(
      { error: 'Failed to seed data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 