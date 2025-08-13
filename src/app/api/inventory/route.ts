import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/lib/inventory.service';
import { jsonRepository } from '@/lib/repository';
import { logger } from '@/lib/logger';

const inventoryService = new InventoryService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || undefined;
    const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined;

    const skip = (page - 1) * limit;
    const take = limit;

    // Debug: Check what's in the repository
    logger.debug('Repository stats before listing', { 
      collections: await jsonRepository.getStats() 
    });

    const items = await inventoryService.list('tenant1', {
      skip,
      take,
      category,
      isActive
    });

    return NextResponse.json({
      items,
      page,
      limit
    });
  } catch (error) {
    logger.error('Failed to fetch inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, ...data } = body;

    let result;
    switch (operation) {
      case 'stockIn':
        result = await inventoryService.stockIn('tenant1', data);
        break;
      case 'stockOut':
        result = await inventoryService.stockOut('tenant1', data);
        break;
      case 'adjustStock':
        result = await inventoryService.adjustStock('tenant1', data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Failed to process inventory operation:', error);
    
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error.message.includes('Insufficient') || error.message.includes('greater than zero')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process inventory operation' },
      { status: 500 }
    );
  }
} 