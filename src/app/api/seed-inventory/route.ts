import { NextRequest, NextResponse } from 'next/server';
import { jsonRepository } from '@/lib/repository';
import { generateId, generateTimestamp } from '@/lib/models';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Starting inventory seeding...');

    // Get all products
    const products = await jsonRepository.findByTenantId('products', 'tenant1');
    logger.info(`Found ${products.length} products to seed inventory for`);

    const inventoryRecords = [];
    let successCount = 0;
    let errorCount = 0;
    let batchCounter = 1;

    for (const product of products) {
      try {
        // Check if inventory already exists
        const existingInventory = await jsonRepository.findInventoryByProductId(product.id, 'tenant1');
        
        if (existingInventory) {
          logger.debug(`Inventory already exists for product ${product.sku}, skipping`);
          continue;
        }

        // Generate random inventory data
        const quantity = Math.floor(Math.random() * 50) + 10; // 10-60 units
        const reservedQuantity = Math.floor(Math.random() * 5) + 1; // 1-6 units
        const reorderPoint = Math.floor(Math.random() * 15) + 5; // 5-20 units
        const reorderQuantity = Math.floor(Math.random() * 100) + 50; // 50-150 units

        // Create inventory record
        const inventoryRecord = await jsonRepository.create('inventories', {
          tenantId: 'tenant1',
          productId: product.id,
          quantity,
          location: 'Main Store',
          batchNumber: `BATCH${String(batchCounter).padStart(3, '0')}`,
          reservedQuantity,
          reorderPoint,
          reorderQuantity,
          lastRestocked: generateTimestamp(),
        });

        inventoryRecords.push(inventoryRecord);
        batchCounter++;
        successCount++;

        logger.debug(`Created inventory for ${product.sku}: ${quantity} units`);

      } catch (error) {
        logger.error(`Failed to create inventory for product ${product.sku}:`, error);
        errorCount++;
      }
    }

    logger.info('Inventory seeding completed', { successCount, errorCount });

    return NextResponse.json({
      success: true,
      message: `Successfully seeded inventory for ${successCount} products`,
      successCount,
      errorCount,
      totalProducts: products.length
    });

  } catch (error) {
    logger.error('Inventory seeding failed', { error });
    return NextResponse.json(
      { error: 'Failed to seed inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 