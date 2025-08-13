"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockAdjustmentSchema = exports.stockOutSchema = exports.stockInSchema = void 0;
// src/modules/inventory/validation/inventory.validation.ts
const zod_1 = require("zod");
// Validation schema for StockInInput
exports.stockInSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1),
    quantity: zod_1.z.number().int().positive(),
    source: zod_1.z.enum(['supplier', 'warehouse', 'initial-stock']),
    referenceId: zod_1.z.string().optional(),
    receivedBy: zod_1.z.string().min(1),
    locationId: zod_1.z.string().optional(),
    batchNumber: zod_1.z.string().optional(),
    expiryDate: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Validation schema for StockOutInput
exports.stockOutSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1),
    quantity: zod_1.z.number().int().positive(),
    destinationType: zod_1.z.enum(['customer', 'warehouse', 'supplier']),
    referenceId: zod_1.z.string().optional(),
    handledBy: zod_1.z.string().min(1),
    locationId: zod_1.z.string().min(1),
    notes: zod_1.z.string().max(500).optional(),
    allowNegativeStock: zod_1.z.boolean().optional(),
});
// Validation schema for StockAdjustmentInput
exports.stockAdjustmentSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1),
    adjustmentType: zod_1.z.enum(['increase', 'decrease']),
    quantity: zod_1.z.number().int().positive(),
    reason: zod_1.z.string().min(1),
    performedBy: zod_1.z.string().min(1),
});
//# sourceMappingURL=inventory.validation.js.map