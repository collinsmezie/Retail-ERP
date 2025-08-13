"use strict";
// src/modules/product/index.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = exports.ProductService = exports.productRoutes = void 0;
var product_routes_1 = require("./routes/product.routes");
Object.defineProperty(exports, "productRoutes", { enumerable: true, get: function () { return product_routes_1.productRoutes; } });
var product_service_1 = require("./services/product.service");
Object.defineProperty(exports, "ProductService", { enumerable: true, get: function () { return product_service_1.ProductService; } });
var product_controller_1 = require("./controllers/product.controller");
Object.defineProperty(exports, "ProductController", { enumerable: true, get: function () { return product_controller_1.ProductController; } });
__exportStar(require("./types/product.types"), exports);
//# sourceMappingURL=index.js.map