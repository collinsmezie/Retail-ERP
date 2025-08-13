import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/product.service';
import { productValidation } from '@/lib/product.validation';

const productService = new ProductService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productService.getById('tenant1', id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const parseResult = productValidation.updateProductSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { errors: parseResult.error.issues },
        { status: 400 }
      );
    }

    const product = await productService.update('tenant1', id, parseResult.data);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Failed to update product:', error);
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    if (error.message === 'Product not found') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await productService.delete('tenant1', id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    
    if (error.message === 'Product not found') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (error.message.includes('existing inventory')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 