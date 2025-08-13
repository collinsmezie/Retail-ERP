import { NextRequest, NextResponse } from 'next/server';
import { staticRepository } from '../../../lib/staticRepository';
import { logger } from '../../../lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching products from static repository');
    
    const products = await staticRepository.findByTenantId('products', 'tenant1');
    
    logger.info(`Found ${products.length} products`);
    
    return NextResponse.json(products);
  } catch (error) {
    logger.error('Failed to fetch products', { error });
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    logger.info('Creating new product', { body });
    
    const product = await staticRepository.create('products', {
      ...body,
      tenantId: 'tenant1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    logger.info('Product created successfully', { productId: product.id });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    logger.error('Failed to create product', { error });
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 