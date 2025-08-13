import { NextRequest, NextResponse } from 'next/server';
import { staticRepository } from '../../../lib/staticRepository';
import { logger } from '../../../lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching inventory from static repository');
    
    const inventories = await staticRepository.findByTenantId('inventories', 'tenant1');
    
    logger.info(`Found ${inventories.length} inventory records`);
    
    return NextResponse.json(inventories);
  } catch (error) {
    logger.error('Failed to fetch inventory', { error });
    return NextResponse.json(
      { error: 'Failed to fetch inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    logger.info('Creating new inventory record', { body });
    
    const inventory = await staticRepository.create('inventories', {
      ...body,
      tenantId: 'tenant1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    logger.info('Inventory record created successfully', { inventoryId: inventory.id });
    
    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    logger.error('Failed to create inventory record', { error });
    return NextResponse.json(
      { error: 'Failed to create inventory record', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 