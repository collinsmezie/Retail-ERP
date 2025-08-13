import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { TenantMiddleware } from '../../../core/tenancy/tenant.middleware';

export class InventoryRoutes {
  private router: Router;
  private controller: InventoryController;

  constructor() {
    this.router = Router();
    this.controller = new InventoryController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Apply tenant middleware to all inventory routes
    this.router.use(TenantMiddleware.resolveTenant);
    this.router.use(TenantMiddleware.requireModule('inventory'));

    // Stock operations
    this.router.post('/stock-in', (req, res) => this.controller.stockIn(req, res));
    this.router.post('/stock-out', (req, res) => this.controller.stockOut(req, res));
    this.router.post('/adjust', (req, res) => this.controller.adjustStock(req, res));
    
    // Inventory queries
    this.router.get('/', (req, res) => this.controller.list(req, res));
    this.router.get('/product/:productId', (req, res) => this.controller.getByProductId(req, res));
  }

  getRouter(): Router {
    return this.router;
  }
}

export const inventoryRoutes = new InventoryRoutes().getRouter(); 