// src/modules/product/validation/product.validation.ts
import { z } from 'zod';

// Validation schema for CreateProductInput
export const createProductSchema = z.object({
  sku: z.string().min(3).max(20),
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  price: z.number().min(0),
  cost: z.number().min(0).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

// Validation schema for UpdateProductInput
export const updateProductSchema = z.object({
  sku: z.string().min(3).max(20).optional(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

// Validation schema for ProductSearchInput
export const productSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  isActive: z.preprocess((v) => v === 'true' ? true : v === 'false' ? false : undefined, z.boolean().optional()),
  minPrice: z.preprocess((v) => v === undefined ? undefined : parseFloat(v as string), z.number().optional()),
  maxPrice: z.preprocess((v) => v === undefined ? undefined : parseFloat(v as string), z.number().optional()),
  page: z.preprocess((v) => v === undefined ? undefined : parseInt(v as string), z.number().int().min(1).optional()),
  limit: z.preprocess((v) => v === undefined ? undefined : parseInt(v as string), z.number().int().min(1).optional()),
}); 