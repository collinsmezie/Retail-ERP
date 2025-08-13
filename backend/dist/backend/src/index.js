"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app_config_1 = require("./core/config/app.config");
const logger_1 = require("./core/utils/logger");
const inventory_routes_1 = require("./modules/inventory/routes/inventory.routes");
const product_routes_1 = require("./modules/product/routes/product.routes");
require("./core/tenancy/tenant.middleware");
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging
app.use((req, _res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        tenantId: req.headers['x-tenant-id']
    });
    next();
});
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: app_config_1.config.server.environment
    });
});
// API routes
app.use('/api/inventory', inventory_routes_1.inventoryRoutes);
app.use('/api/products', product_routes_1.productRoutes);
// 404 handler
app.use('*', (_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((error, req, res, _next) => {
    logger_1.logger.error('Unhandled error', { error, path: req.path });
    res.status(500).json({ error: 'Internal server error' });
});
exports.default = app;
//# sourceMappingURL=index.js.map