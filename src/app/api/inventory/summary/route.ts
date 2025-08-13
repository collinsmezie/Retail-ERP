import { NextRequest, NextResponse } from 'next/server';
import { staticRepository } from '../../../../lib/staticRepository';
import { logger } from '../../../../lib/logger';

interface InventoryItem {
  id: string;
  tenantId: string;
  productId: string;
  quantity: number;
  reorderPoint: number;
}

interface Product {
  id: string;
  price: number;
}

export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching inventory summary from static repository');
    
    const inventories = await staticRepository.findByTenantId<InventoryItem>('inventories', 'tenant1');
    const products = await staticRepository.findByTenantId<Product>('products', 'tenant1');
    
    // Calculate summary statistics
    const totalProducts = products.length;
    const totalInventory = inventories.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
    const lowStockItems = inventories.filter(inv => (inv.quantity || 0) <= (inv.reorderPoint || 10)).length;
    
    // Calculate total value
    let totalValue = 0;
    for (const inventory of inventories) {
      const product = products.find(p => p.id === inventory.productId);
      if (product && product.price) {
        totalValue += (product.price * (inventory.quantity || 0));
      }
    }
    
    const summary = {
      totalProducts,
      totalInventory,
      lowStockItems,
      totalValue: Math.round(totalValue * 100) / 100,
      lastUpdated: new Date().toISOString()
    };
    
    logger.info('Inventory summary calculated', summary);
    
    return NextResponse.json(summary);
  } catch (error) {
    logger.error('Failed to fetch inventory summary', { error });
    return NextResponse.json(
      { error: 'Failed to fetch inventory summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 