"use strict";
// src/modules/product/routes/product.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = exports.ProductRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const tenant_middleware_1 = require("../../../core/tenancy/tenant.middleware");
class ProductRoutes {
    router;
    controller;
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new product_controller_1.ProductController();
        this.setupRoutes();
    }
    setupRoutes() {
        // Apply tenant middleware to all product routes
        this.router.use(tenant_middleware_1.TenantMiddleware.resolveTenant);
        this.router.use(tenant_middleware_1.TenantMiddleware.requireModule('inventory')); // Products are part of inventory module
        // Product CRUD operations
        this.router.post('/', (req, res) => this.controller.create(req, res));
        this.router.get('/', (req, res) => this.controller.list(req, res));
        this.router.get('/:productId', (req, res) => this.controller.getById(req, res));
        this.router.get('/sku/:sku', (req, res) => this.controller.getBySku(req, res));
        this.router.get('/:productId/inventory', (req, res) => this.controller.getWithInventory(req, res));
        this.router.put('/:productId', (req, res) => this.controller.update(req, res));
        this.router.delete('/:productId', (req, res) => this.controller.delete(req, res));
        // Product lifecycle operations
        this.router.patch('/:productId/activate', (req, res) => this.controller.activate(req, res));
        this.router.patch('/:productId/deactivate', (req, res) => this.controller.deactivate(req, res));
    }
    getRouter() {
        return this.router;
    }
}
exports.ProductRoutes = ProductRoutes;
exports.productRoutes = new ProductRoutes().getRouter();
//# sourceMappingURL=product.routes.js.map