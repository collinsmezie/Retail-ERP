"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSearchSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
// src/modules/product/validation/product.validation.ts
const zod_1 = require("zod");
// Validation schema for CreateProductInput
exports.createProductSchema = zod_1.z.object({
    sku: zod_1.z.string().min(3).max(20),
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0),
    cost: zod_1.z.number().min(0).optional(),
    category: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Validation schema for UpdateProductInput
exports.updateProductSchema = zod_1.z.object({
    sku: zod_1.z.string().min(3).max(20).optional(),
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0).optional(),
    cost: zod_1.z.number().min(0).optional(),
    category: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Validation schema for ProductSearchInput
exports.productSearchSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    isActive: zod_1.z.preprocess((v) => v === 'true' ? true : v === 'false' ? false : undefined, zod_1.z.boolean().optional()),
    minPrice: zod_1.z.preprocess((v) => v === undefined ? undefined : parseFloat(v), zod_1.z.number().optional()),
    maxPrice: zod_1.z.preprocess((v) => v === undefined ? undefined : parseFloat(v), zod_1.z.number().optional()),
    page: zod_1.z.preprocess((v) => v === undefined ? undefined : parseInt(v), zod_1.z.number().int().min(1).optional()),
    limit: zod_1.z.preprocess((v) => v === undefined ? undefined : parseInt(v), zod_1.z.number().int().min(1).optional()),
});
//# sourceMappingURL=product.validation.js.map