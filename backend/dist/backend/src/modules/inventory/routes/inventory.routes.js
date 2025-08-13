"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRoutes = exports.InventoryRoutes = void 0;
const express_1 = require("express");
const inventory_controller_1 = require("../controllers/inventory.controller");
const tenant_middleware_1 = require("../../../core/tenancy/tenant.middleware");
class InventoryRoutes {
    router;
    controller;
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new inventory_controller_1.InventoryController();
        this.setupRoutes();
    }
    setupRoutes() {
        // Apply tenant middleware to all inventory routes
        this.router.use(tenant_middleware_1.TenantMiddleware.resolveTenant);
        this.router.use(tenant_middleware_1.TenantMiddleware.requireModule('inventory'));
        // Stock operations
        this.router.post('/stock-in', (req, res) => this.controller.stockIn(req, res));
        this.router.post('/stock-out', (req, res) => this.controller.stockOut(req, res));
        this.router.post('/adjust', (req, res) => this.controller.adjustStock(req, res));
        // Inventory queries
        this.router.get('/', (req, res) => this.controller.list(req, res));
        this.router.get('/product/:productId', (req, res) => this.controller.getByProductId(req, res));
    }
    getRouter() {
        return this.router;
    }
}
exports.InventoryRoutes = InventoryRoutes;
exports.inventoryRoutes = new InventoryRoutes().getRouter();
//# sourceMappingURL=inventory.routes.js.map