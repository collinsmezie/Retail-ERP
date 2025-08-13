import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service';
import { logger } from '../../../core/utils/logger';
import { stockInSchema, stockOutSchema, stockAdjustmentSchema } from '../validation/inventory.validation';

export class InventoryController {
  private service: InventoryService;

  constructor() {
    this.service = new InventoryService();
  }

  async stockIn(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1'; // Default for testing
      const parseResult = stockInSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.issues });
        return;
      }
      const input = parseResult.data;
      const inventory = await this.service.stockIn(tenantId, input);
      res.status(201).json(inventory);
    } catch (error) {
      logger.error('Failed to stock in', {
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
        tenantId: req.tenant?.tenantId,
        input: req.body
      });
      
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          res.status(404).json({ error: 'Product not found' });
          return;
        }
        if (error.message === 'Quantity must be greater than zero') {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to stock in',
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }



  async stockOut(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1'; // Default for testing
      const parseResult = stockOutSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.issues });
        return;
      }
      const stockOut = parseResult.data;
      const inventory = await this.service.stockOut(tenantId, stockOut);
      res.json(inventory);
    } catch (error) {
      logger.error('Failed to stock out', {
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
        tenantId: req.tenant?.tenantId,
        stockOut: req.body
      });
      
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          res.status(404).json({ error: 'Product not found' });
          return;
        }
        if (error.message === 'Inventory record not found') {
          res.status(404).json({ error: 'Inventory record not found' });
          return;
        }
        if (error.message === 'Insufficient inventory') {
          res.status(400).json({ error: 'Insufficient inventory' });
          return;
        }
        if (error.message === 'Quantity must be greater than zero') {
          res.status(400).json({ error: error.message });
          return;
        }
      }
      
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to stock out',
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  async getByProductId(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1'; // Default for testing
      const { productId } = req.params;

      const inventory = await this.service.getByProductId(tenantId, productId);
      if (!inventory) {
        res.status(404).json({ error: 'Inventory not found' });
        return;
      }

      res.json(inventory);
    } catch (error) {
      logger.error('Failed to get inventory by product ID', { error, tenantId: req.tenant?.tenantId, productId: req.params.productId });
      res.status(500).json({ error: 'Failed to get inventory' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1'; // Default for testing
      const { 
        page = '1',
        limit = '20', 
        category,
        isActive
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const items = await this.service.list(tenantId, {
        skip,
        take,
        category: category as string,
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
      });

      res.json({
        items,
        page: parseInt(page as string),
        limit: take
      });
    } catch (error) {
      logger.error('Failed to list inventory', { error, tenantId: req.tenant?.tenantId });
      res.status(500).json({ error: 'Failed to list inventory' });
    }
  }

  async adjustStock(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1'; // Default for testing
      const parseResult = stockAdjustmentSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.issues });
        return;
      }
      const adjustment = parseResult.data;
      // Placeholder for authorization check
      // if (!req.user || !req.user.roles.includes('inventory')) {
      //   return res.status(403).json({ error: 'Forbidden' });
      // }
      const allowNegativeStock = false; // TODO: make configurable
      const inventory = await this.service.adjustStock(tenantId, adjustment, allowNegativeStock);
      res.json(inventory);
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      if (error instanceof Error && error.message === 'Inventory record not found') {
        res.status(404).json({ error: 'Inventory record not found' });
        return;
      }
      if (error instanceof Error && error.message === 'Insufficient inventory for adjustment') {
        res.status(400).json({ error: 'Insufficient inventory for adjustment' });
        return;
      }
      res.status(500).json({ error: 'Failed to adjust stock' });
    }
  }
} 