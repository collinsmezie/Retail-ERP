// src/modules/product/controllers/product.controller.ts

import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { logger } from '../../../core/utils/logger';
import { createProductSchema, updateProductSchema, productSearchSchema } from '../validation/product.validation';

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1'; // Default for testing
      // Zod validation
      const parseResult = createProductSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.issues });
        return;
      }
      const input = parseResult.data;
      const product = await this.service.create(tenantId, input);
      res.status(201).json(product);
    } catch (error) {
      logger.error('Failed to create product', {
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

  async update(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      const { productId } = req.params;
      // Zod validation
      const parseResult = updateProductSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.issues });
        return;
      }
      const update = parseResult.data;
      const product = await this.service.update(tenantId, productId, update);
      res.json(product);
    } catch (error) {
      logger.error('Failed to update product', {
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

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      const { productId } = req.params;

      const product = await this.service.getById(tenantId, productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error) {
      logger.error('Failed to get product by ID', { 
        error, 
        tenantId: req.tenant?.tenantId, 
        productId: req.params.productId 
      });
      res.status(500).json({ error: 'Failed to get product' });
    }
  }

  async getBySku(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      const { sku } = req.params;

      const product = await this.service.getBySku(tenantId, sku);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error) {
      logger.error('Failed to get product by SKU', { 
        error, 
        tenantId: req.tenant?.tenantId, 
        sku: req.params.sku 
      });
      res.status(500).json({ error: 'Failed to get product' });
    }
  }

  async getWithInventory(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      const { productId } = req.params;

      const product = await this.service.getWithInventory(tenantId, productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error) {
      logger.error('Failed to get product with inventory', { 
        error, 
        tenantId: req.tenant?.tenantId, 
        productId: req.params.productId 
      });
      res.status(500).json({ error: 'Failed to get product' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      // Zod validation for query params
      const parseResult = productSearchSchema.safeParse(req.query);
      if (!parseResult.success) {
        res.status(400).json({ errors: parseResult.error.issues });
        return;
      }
      const searchInput = parseResult.data;
      const result = await this.service.list(tenantId, searchInput);
      res.json(result);
    } catch (error) {
      logger.error('Failed to list products', { 
        error, 
        tenantId: req.tenant?.tenantId,
        query: req.query 
      });
      res.status(500).json({ error: 'Failed to list products' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      const { productId } = req.params;

      await this.service.delete(tenantId, productId);
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete product', {
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

  async activate(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      const { productId } = req.params;

      const product = await this.service.activate(tenantId, productId);
      res.json(product);
    } catch (error) {
      logger.error('Failed to activate product', {
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

  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.tenant?.tenantId || 'tenant1';
      const { productId } = req.params;

      const product = await this.service.deactivate(tenantId, productId);
      res.json(product);
    } catch (error) {
      logger.error('Failed to deactivate product', {
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