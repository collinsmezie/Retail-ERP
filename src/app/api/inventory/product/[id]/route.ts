import { NextRequest, NextResponse } from 'next/server';
import { staticRepository } from '../../../../../lib/staticRepository';
import { logger } from '../../../../../lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    logger.info(`Fetching inventory for product ID: ${id}`);
    
    const inventory = await staticRepository.findInventoryByProductId(id, 'tenant1');
    
    if (!inventory) {
      logger.warn(`Inventory not found for product ID: ${id}`);
      return NextResponse.json(
        { error: 'Inventory not found for this product' },
        { status: 404 }
      );
    }
    
    logger.info(`Inventory found for product ID: ${id}`);
    return NextResponse.json(inventory);
  } catch (error) {
    logger.error(`Failed to fetch inventory for product ID: ${params.id}`, { error });
    return NextResponse.json(
      { error: 'Failed to fetch inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    logger.info(`Updating inventory for product ID: ${id}`, { body });
    
    // Find the inventory record first
    const existingInventory = await staticRepository.findInventoryByProductId(id, 'tenant1');
    
    if (!existingInventory) {
      logger.warn(`Inventory not found for update with product ID: ${id}`);
      return NextResponse.json(
        { error: 'Inventory not found for this product' },
        { status: 404 }
      );
    }
    
    const updatedInventory = await staticRepository.update('inventories', existingInventory.id, {
      ...body,
      updatedAt: new Date().toISOString()
    });
    
    logger.info(`Inventory updated successfully for product ID: ${id}`);
    return NextResponse.json(updatedInventory);
  } catch (error) {
    logger.error(`Failed to update inventory for product ID: ${params.id}`, { error });
    return NextResponse.json(
      { error: 'Failed to update inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 