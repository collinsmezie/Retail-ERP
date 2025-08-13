"use strict";
// src/modules/product/controllers/product.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const logger_1 = require("../../../core/utils/logger");
const product_validation_1 = require("../validation/product.validation");
class ProductController {
    service;
    constructor() {
        this.service = new product_service_1.ProductService();
    }
    async create(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1'; // Default for testing
            // Zod validation
            const parseResult = product_validation_1.createProductSchema.safeParse(req.body);
            if (!parseResult.success) {
                res.status(400).json({ errors: parseResult.error.issues });
                return;
            }
            const input = parseResult.data;
            const product = await this.service.create(tenantId, input);
            res.status(201).json(product);
        }
        catch (error) {
            logger_1.logger.error('Failed to create product', {
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
                tenantId: req.tenant?.tenantId,
                input: req.body
            });
            if (error instanceof Error) {
                if (error.message.includes('already exists')) {
                    res.status(409).json({ error: error.message });
                    return;
                }
                if (error.message.includes('required')) {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to create product',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }
    }
    async update(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            const { productId } = req.params;
            // Zod validation
            const parseResult = product_validation_1.updateProductSchema.safeParse(req.body);
            if (!parseResult.success) {
                res.status(400).json({ errors: parseResult.error.issues });
                return;
            }
            const update = parseResult.data;
            const product = await this.service.update(tenantId, productId, update);
            res.json(product);
        }
        catch (error) {
            logger_1.logger.error('Failed to update product', {
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
                tenantId: req.tenant?.tenantId,
                productId: req.params.productId,
                update: req.body
            });
            if (error instanceof Error) {
                if (error.message === 'Product not found') {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }
                if (error.message.includes('already exists')) {
                    res.status(409).json({ error: error.message });
                    return;
                }
                if (error.message.includes('cannot be negative')) {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to update product',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }
    }
    async getById(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            const { productId } = req.params;
            const product = await this.service.getById(tenantId, productId);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json(product);
        }
        catch (error) {
            logger_1.logger.error('Failed to get product by ID', {
                error,
                tenantId: req.tenant?.tenantId,
                productId: req.params.productId
            });
            res.status(500).json({ error: 'Failed to get product' });
        }
    }
    async getBySku(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            const { sku } = req.params;
            const product = await this.service.getBySku(tenantId, sku);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json(product);
        }
        catch (error) {
            logger_1.logger.error('Failed to get product by SKU', {
                error,
                tenantId: req.tenant?.tenantId,
                sku: req.params.sku
            });
            res.status(500).json({ error: 'Failed to get product' });
        }
    }
    async getWithInventory(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            const { productId } = req.params;
            const product = await this.service.getWithInventory(tenantId, productId);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.json(product);
        }
        catch (error) {
            logger_1.logger.error('Failed to get product with inventory', {
                error,
                tenantId: req.tenant?.tenantId,
                productId: req.params.productId
            });
            res.status(500).json({ error: 'Failed to get product' });
        }
    }
    async list(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            // Zod validation for query params
            const parseResult = product_validation_1.productSearchSchema.safeParse(req.query);
            if (!parseResult.success) {
                res.status(400).json({ errors: parseResult.error.issues });
                return;
            }
            const searchInput = parseResult.data;
            const result = await this.service.list(tenantId, searchInput);
            res.json(result);
        }
        catch (error) {
            logger_1.logger.error('Failed to list products', {
                error,
                tenantId: req.tenant?.tenantId,
                query: req.query
            });
            res.status(500).json({ error: 'Failed to list products' });
        }
    }
    async delete(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            const { productId } = req.params;
            await this.service.delete(tenantId, productId);
            res.status(204).send();
        }
        catch (error) {
            logger_1.logger.error('Failed to delete product', {
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
                tenantId: req.tenant?.tenantId,
                productId: req.params.productId
            });
            if (error instanceof Error) {
                if (error.message === 'Product not found') {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }
                if (error.message.includes('existing inventory')) {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to delete product',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }
    }
    async activate(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            const { productId } = req.params;
            const product = await this.service.activate(tenantId, productId);
            res.json(product);
        }
        catch (error) {
            logger_1.logger.error('Failed to activate product', {
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
                tenantId: req.tenant?.tenantId,
                productId: req.params.productId
            });
            if (error instanceof Error && error.message === 'Product not found') {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to activate product',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }
    }
    async deactivate(req, res) {
        try {
            const tenantId = req.tenant?.tenantId || 'tenant1';
            const { productId } = req.params;
            const product = await this.service.deactivate(tenantId, productId);
            res.json(product);
        }
        catch (error) {
            logger_1.logger.error('Failed to deactivate product', {
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
                tenantId: req.tenant?.tenantId,
                productId: req.params.productId
            });
            if (error instanceof Error && error.message === 'Product not found') {
                res.status(404).json({ error: 'Product not found' });
                return;
            }
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to deactivate product',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map