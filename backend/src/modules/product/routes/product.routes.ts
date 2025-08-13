// src/modules/product/routes/product.routes.ts

import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { TenantMiddleware } from '../../../core/tenancy/tenant.middleware';

export class ProductRoutes {
  private router: Router;
  private controller: ProductController;

  constructor() {
    this.router = Router();
    this.controller = new ProductController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Apply tenant middleware to all product routes
    this.router.use(TenantMiddleware.resolveTenant);
    this.router.use(TenantMiddleware.requireModule('inventory')); // Products are part of inventory module

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

  getRouter(): Router {
    return this.router;
  }
}

export const productRoutes = new ProductRoutes().getRouter(); 