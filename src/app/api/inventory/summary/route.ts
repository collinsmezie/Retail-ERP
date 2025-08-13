import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/lib/inventory.service';

const inventoryService = new InventoryService();

export async function GET(request: NextRequest) {
  try {
    const summary = await inventoryService.getSummary('tenant1');
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Failed to fetch inventory summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory summary' },
      { status: 500 }
    );
  }
} 