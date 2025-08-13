import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/lib/inventory.service';

const inventoryService = new InventoryService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inventory = await inventoryService.getByProductId('tenant1', id);
    
    if (!inventory) {
      return NextResponse.json(
        { error: 'Inventory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Failed to fetch inventory by product ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
} 