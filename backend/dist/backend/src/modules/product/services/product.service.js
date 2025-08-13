"use strict";
// src/modules/product/services/product.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const db_1 = require("../../../core/db");
const logger_1 = require("../../../core/utils/logger");
const buildProductUpdateData_1 = require("../../../../../shared/utils/buildProductUpdateData");
class ProductService {
    async create(tenantId, input) {
        logger_1.logger.debug('Creating product', { tenantId, input });
        // Business rule: Validate SKU uniqueness within tenant
        const existingProduct = await db_1.prisma.product.findFirst({
            where: {
                tenantId,
                sku: input.sku
            }
        });
        if (existingProduct) {
            throw new Error(`Product with SKU '${input.sku}' already exists`);
        }
        // Input validation is handled in the controller using Zod
        const product = await db_1.prisma.product.create({
            data: {
                tenantId,
                sku: input.sku,
                name: input.name,
                description: input.description,
                price: input.price,
                cost: input.cost || 0,
                category: input.category,
                brand: input.brand,
                attributes: input.attributes ? JSON.stringify(input.attributes) : null,
                isActive: input.isActive !== false // default to true
            }
        });
        logger_1.logger.info('Product created', {
            tenantId,
            productId: product.id,
            sku: product.sku,
            name: product.name
        });
        return this.mapToProductView(product);
    }
    async update(tenantId, productId, update) {
        logger_1.logger.debug('Updating product', { tenantId, productId, update });
        // Check if product exists and belongs to tenant
        const existingProduct = await db_1.prisma.product.findFirst({
            where: {
                id: productId,
                tenantId
            }
        });
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        // If SKU is being updated, check uniqueness
        if (update.sku && update.sku !== existingProduct.sku) {
            const duplicateSku = await db_1.prisma.product.findFirst({
                where: {
                    tenantId,
                    sku: update.sku,
                    id: { not: productId }
                }
            });
            if (duplicateSku) {
                throw new Error(`Product with SKU '${update.sku}' already exists`);
            }
        }
        const updateData = (0, buildProductUpdateData_1.buildProductUpdateData)(update);
        const product = await db_1.prisma.product.update({
            where: { id: productId },
            data: updateData
        });
        logger_1.logger.info('Product updated', {
            tenantId,
            productId: product.id,
            sku: product.sku,
            name: product.name
        });
        return this.mapToProductView(product);
    }
    async getById(tenantId, productId) {
        logger_1.logger.debug('Getting product by ID', { tenantId, productId });
        const product = await db_1.prisma.product.findFirst({
            where: {
                id: productId,
                tenantId
            }
        });
        return product ? this.mapToProductView(product) : null;
    }
    async getBySku(tenantId, sku) {
        logger_1.logger.debug('Getting product by SKU', { tenantId, sku });
        const product = await db_1.prisma.product.findFirst({
            where: {
                sku,
                tenantId
            }
        });
        return product ? this.mapToProductView(product) : null;
    }
    async getWithInventory(tenantId, productId) {
        logger_1.logger.debug('Getting product with inventory', { tenantId, productId });
        const product = await db_1.prisma.product.findFirst({
            where: {
                id: productId,
                tenantId
            },
            include: {
                inventory: true
            }
        });
        if (!product)
            return null;
        const productView = this.mapToProductView(product);
        const inventory = product.inventory[0]; // Assuming one inventory record per product
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
    async list(tenantId, searchInput = {}) {
        logger_1.logger.debug('Listing products', { tenantId, searchInput });
        const { search, category, brand, isActive, minPrice, maxPrice, page = 1, limit = 20 } = searchInput;
        const skip = (page - 1) * limit;
        const take = limit;
        // Build where clause
        const where = { tenantId };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category)
            where.category = category;
        if (brand)
            where.brand = brand;
        if (isActive !== undefined)
            where.isActive = isActive;
        if (minPrice !== undefined)
            where.price = { gte: minPrice };
        if (maxPrice !== undefined) {
            if (minPrice !== undefined) {
                where.price = { gte: minPrice, lte: maxPrice };
            }
            else {
                where.price = { lte: maxPrice };
            }
        }
        const [products, total] = await Promise.all([
            db_1.prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { name: 'asc' }
            }),
            db_1.prisma.product.count({ where })
        ]);
        return {
            items: products.map(product => this.mapToProductView(product)),
            total,
            page,
            limit
        };
    }
    async delete(tenantId, productId) {
        logger_1.logger.debug('Deleting product', { tenantId, productId });
        // Check if product exists and belongs to tenant
        const product = await db_1.prisma.product.findFirst({
            where: {
                id: productId,
                tenantId
            },
            include: {
                inventory: true
            }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        // Check if product has inventory
        if (product.inventory.length > 0) {
            const hasStock = product.inventory.some(inv => inv.quantity > 0);
            if (hasStock) {
                throw new Error('Cannot delete product with existing inventory');
            }
        }
        await db_1.prisma.product.delete({
            where: { id: productId }
        });
        logger_1.logger.info('Product deleted', {
            tenantId,
            productId,
            sku: product.sku,
            name: product.name
        });
    }
    async activate(tenantId, productId) {
        logger_1.logger.debug('Activating product', { tenantId, productId });
        const product = await db_1.prisma.product.update({
            where: {
                id: productId,
                tenantId
            },
            data: { isActive: true }
        });
        logger_1.logger.info('Product activated', {
            tenantId,
            productId: product.id,
            sku: product.sku
        });
        return this.mapToProductView(product);
    }
    async deactivate(tenantId, productId) {
        logger_1.logger.debug('Deactivating product', { tenantId, productId });
        const product = await db_1.prisma.product.update({
            where: {
                id: productId,
                tenantId
            },
            data: { isActive: false }
        });
        logger_1.logger.info('Product deactivated', {
            tenantId,
            productId: product.id,
            sku: product.sku
        });
        return this.mapToProductView(product);
    }
    mapToProductView(product) {
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
            attributes: product.attributes ? JSON.parse(product.attributes) : null,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map