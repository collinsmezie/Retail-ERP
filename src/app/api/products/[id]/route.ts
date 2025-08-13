import { NextRequest, NextResponse } from 'next/server';
import { staticRepository } from '../../../../lib/staticRepository';
import { logger } from '../../../../lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    logger.info(`Fetching product with ID: ${id}`);
    
    const product = await staticRepository.findById('products', id);
    
    if (!product) {
      logger.warn(`Product not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    logger.info(`Product found: ${product.name}`);
    return NextResponse.json(product);
  } catch (error) {
    logger.error(`Failed to fetch product with ID: ${params.id}`, { error });
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error instanceof Error ? error.message : 'Unknown error' },
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
    logger.info(`Updating product with ID: ${id}`, { body });
    
    const updatedProduct = await staticRepository.update('products', id, {
      ...body,
      updatedAt: new Date().toISOString()
    });
    
    if (!updatedProduct) {
      logger.warn(`Product not found for update with ID: ${id}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    logger.info(`Product updated successfully: ${updatedProduct.name}`);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    logger.error(`Failed to update product with ID: ${params.id}`, { error });
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    logger.info(`Deleting product with ID: ${id}`);
    
    const success = await staticRepository.delete('products', id);
    
    if (!success) {
      logger.warn(`Product not found for deletion with ID: ${id}`);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    logger.info(`Product deleted successfully with ID: ${id}`);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    logger.error(`Failed to delete product with ID: ${params.id}`, { error });
    return NextResponse.json(
      { error: 'Failed to delete product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 