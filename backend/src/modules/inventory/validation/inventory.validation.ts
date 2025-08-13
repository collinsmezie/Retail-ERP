// src/modules/inventory/validation/inventory.validation.ts
import { z } from 'zod';

// Validation schema for StockInInput
export const stockInSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  source: z.enum(['supplier', 'warehouse', 'initial-stock']),
  referenceId: z.string().optional(),
  receivedBy: z.string().min(1),
  locationId: z.string().optional(),
  batchNumber: z.string().optional(),
  expiryDate: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

// Validation schema for StockOutInput
export const stockOutSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  destinationType: z.enum(['customer', 'warehouse', 'supplier']),
  referenceId: z.string().optional(),
  handledBy: z.string().min(1),
  locationId: z.string().min(1),
  notes: z.string().max(500).optional(),
  allowNegativeStock: z.boolean().optional(),
});

// Validation schema for StockAdjustmentInput
export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1),
  adjustmentType: z.enum(['increase', 'decrease']),
  quantity: z.number().int().positive(),
  reason: z.string().min(1),
  performedBy: z.string().min(1),
}); 