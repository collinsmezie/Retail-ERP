import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/product.service';
import { productValidation } from '@/lib/product.validation';

const productService = new ProductService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await productService.list('tenant1', {
      search,
      category,
      brand,
      isActive,
      minPrice,
      maxPrice,
      page,
      limit
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parseResult = productValidation.createProductSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { errors: parseResult.error.issues },
        { status: 400 }
      );
    }

    const product = await productService.create('tenant1', parseResult.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 