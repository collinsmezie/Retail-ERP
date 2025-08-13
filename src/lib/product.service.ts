// src/modules/product/services/product.service.ts

import { jsonRepository } from './repository';
import { logger } from './logger';
import {
  ProductView,
  ProductWithInventory,
  CreateProductInput,
  UpdateProductInput,
  ProductSearchInput,
} from '../shared/types/product.types';
import { buildProductUpdateData } from './buildProductUpdateData';

export class ProductService {
  async create(tenantId: string, input: CreateProductInput): Promise<ProductView> {
    logger.debug('Creating product', { tenantId, input });

    // Business rule: Validate SKU uniqueness within tenant
    const existingProducts = await jsonRepository.findByTenantId('products', tenantId);
    const existingProduct = existingProducts.find(p => p.sku === input.sku);

    if (existingProduct) {
      throw new Error(`Product with SKU '${input.sku}' already exists`);
    }

    // Input validation is handled in the controller using Zod

    const product = await jsonRepository.create('products', {
      tenantId,
      sku: input.sku,
      name: input.name,
      description: input.description,
      price: input.price,
      cost: input.cost || 0,
      category: input.category,
      brand: input.brand,
      attributes: input.attributes ? JSON.stringify(input.attributes) : undefined,
      isActive: input.isActive !== false // default to true
    });

    logger.info('Product created', {
      tenantId,
      productId: product.id,
      sku: product.sku,
      name: product.name
    });

    return this.mapToProductView(product);
  }

  async update(tenantId: string, productId: string, update: UpdateProductInput): Promise<ProductView> {
    logger.debug('Updating product', { tenantId, productId, update });

    // Check if product exists and belongs to tenant
    const existingProduct = await jsonRepository.findById('products', productId);
    if (!existingProduct || existingProduct.tenantId !== tenantId) {
      throw new Error('Product not found');
    }

    // If SKU is being updated, check uniqueness
    if (update.sku && update.sku !== existingProduct.sku) {
      const existingProducts = await jsonRepository.findByTenantId('products', tenantId);
      const duplicateSku = existingProducts.find(p => p.sku === update.sku && p.id !== productId);

      if (duplicateSku) {
        throw new Error(`Product with SKU '${update.sku}' already exists`);
      }
    }

    const updateData = buildProductUpdateData(update);

    const product = await jsonRepository.update('products', productId, updateData);
    if (!product) {
      throw new Error('Failed to update product');
    }

    logger.info('Product updated', {
      tenantId,
      productId: product.id,
      sku: product.sku,
      name: product.name
    });

    return this.mapToProductView(product);
  }

  async getById(tenantId: string, productId: string): Promise<ProductView | null> {
    logger.debug('Getting product by ID', { tenantId, productId });

    const product = await jsonRepository.findById('products', productId);
    if (!product || product.tenantId !== tenantId) {
      return null;
    }

    return this.mapToProductView(product);
  }

  async getBySku(tenantId: string, sku: string): Promise<ProductView | null> {
    logger.debug('Getting product by SKU', { tenantId, sku });

    const products = await jsonRepository.findByTenantId('products', tenantId);
    const product = products.find(p => p.sku === sku);

    return product ? this.mapToProductView(product) : null;
  }

  async getWithInventory(tenantId: string, productId: string): Promise<ProductWithInventory | null> {
    logger.debug('Getting product with inventory', { tenantId, productId });

    const product = await jsonRepository.findById('products', productId);
    if (!product || product.tenantId !== tenantId) return null;

    const inventory = await jsonRepository.findInventoryByProductId(productId, tenantId);
    const productView = this.mapToProductView(product);

    return {
      ...productView,
      inventory: inventory ? {
        id: inventory.id,
        quantity: inventory.quantity,
        reservedQuantity: inventory.reservedQuantity,
        reorderPoint: inventory.reorderPoint,
        reorderQuantity: inventory.reorderQuantity,
        location: inventory.location,
        batchNumber: inventory.batchNumber,
        expiryDate: inventory.expiryDate,
        lastRestocked: inventory.lastRestocked,
        lastSold: inventory.lastSold,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt
      } : null
    };
  }

  async list(tenantId: string, searchInput: ProductSearchInput = {}): Promise<{
    items: ProductView[];
    total: number;
    page: number;
    limit: number;
  }> {
    logger.debug('Listing products', { tenantId, searchInput });

    const {
      search,
      category,
      brand,
      isActive,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20
    } = searchInput;

    // Get all products for this tenant
    let products = await jsonRepository.findByTenantId('products', tenantId);

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    if (category) {
      products = products.filter(p => p.category === category);
    }

    if (brand) {
      products = products.filter(p => p.brand === brand);
    }

    if (isActive !== undefined) {
      products = products.filter(p => p.isActive === isActive);
    }

    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= maxPrice);
    }

    // Apply pagination
    const total = products.length;
    const skip = (page - 1) * limit;
    const items = products.slice(skip, skip + limit).map(p => this.mapToProductView(p));

    return {
      items,
      total,
      page,
      limit
    };
  }

  async delete(tenantId: string, productId: string): Promise<void> {
    logger.debug('Deleting product', { tenantId, productId });

    // Check if product exists and belongs to tenant
    const product = await jsonRepository.findById('products', productId);
    if (!product || product.tenantId !== tenantId) {
      throw new Error('Product not found');
    }

    // Check if product has inventory
    const inventory = await jsonRepository.findInventoryByProductId(productId, tenantId);
    if (inventory && inventory.quantity > 0) {
      throw new Error('Cannot delete product with existing inventory');
    }

    // Delete the product
    const deleted = await jsonRepository.delete('products', productId);
    if (!deleted) {
      throw new Error('Failed to delete product');
    }

    // Delete associated inventory record if it exists
    if (inventory) {
      await jsonRepository.delete('inventories', inventory.id);
    }

    logger.info('Product deleted', { tenantId, productId });
  }

  async activate(tenantId: string, productId: string): Promise<ProductView> {
    logger.debug('Activating product', { tenantId, productId });

    const product = await jsonRepository.update('products', productId, { isActive: true });
    if (!product || product.tenantId !== tenantId) {
      throw new Error('Product not found');
    }

    logger.info('Product activated', { tenantId, productId });
    return this.mapToProductView(product);
  }

  async deactivate(tenantId: string, productId: string): Promise<ProductView> {
    logger.debug('Deactivating product', { tenantId, productId });

    const product = await jsonRepository.update('products', productId, { isActive: false });
    if (!product || product.tenantId !== tenantId) {
      throw new Error('Product not found');
    }

    logger.info('Product deactivated', { tenantId, productId });
    return this.mapToProductView(product);
  }

  private mapToProductView(product: any): ProductView {
    return {
      id: product.id,
      tenantId: product.tenantId,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      category: product.category,
      brand: product.brand,
      attributes: product.attributes ? JSON.parse(product.attributes) : undefined,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }
} 