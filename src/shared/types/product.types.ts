export interface ProductView {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  category?: string;
  brand?: string;
  attributes?: Record<string, unknown>;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithInventory extends ProductView {
  inventory: {
    id: string;
    quantity: number;
    reservedQuantity: number;
    reorderPoint: number;
    reorderQuantity: number;
    location: string | null;
    batchNumber: string | null;
    expiryDate: Date | null;
    lastRestocked: Date | null;
    lastSold: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export interface CreateProductInput {
  sku: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  category?: string;
  brand?: string;
  attributes?: Record<string, unknown>;
  isActive?: boolean;
}

export interface UpdateProductInput {
  sku?: string;
  name?: string;
  description?: string;
  price?: number;
  cost?: number;
  category?: string;
  brand?: string;
  attributes?: Record<string, unknown>;
  isActive?: boolean;
}

export interface ProductSearchInput {
  search?: string;
  category?: string;
  brand?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
} 