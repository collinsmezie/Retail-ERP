import { jsonRepository } from './repository';
import { InventoryView, StockOutInput, StockAdjustmentInput, StockInInput } from '../shared/types/inventory.types';
import { logger } from './logger';
import { generateTimestamp } from './models';

export class InventoryService {
  /**
   * StockIn - Enhanced stock-in operation with proper validation and logging
   */
  async stockIn(tenantId: string, input: StockInInput): Promise<InventoryView> {
    logger.debug('stockIn called', { tenantId, input });
    
    try {
      // Business Rule: Cannot receive zero or negative quantity
      if (input.quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }

      // Validate the product exists
      logger.debug('Checking if product exists', { productId: input.productId, tenantId });
      const product = await jsonRepository.findById('products', input.productId);
      logger.debug('Product lookup result', { product });
      if (!product || product.tenantId !== tenantId) throw new Error('Product not found');

      // Find or create inventory record for this product
      logger.debug('Looking for existing inventory record', { tenantId, productId: input.productId });
      let inventory = await jsonRepository.findInventoryByProductId(input.productId, tenantId);
      logger.debug('Inventory lookup result', { inventory });

      if (inventory) {
        // Update existing inventory
        logger.debug('Updating existing inventory quantity', { 
          inventoryId: inventory.id, 
          increment: input.quantity 
        });
        
        const updatedInventory = await jsonRepository.update('inventories', inventory.id, {
          quantity: inventory.quantity + input.quantity,
          lastRestocked: generateTimestamp(),
          ...(input.expiryDate && { expiryDate: input.expiryDate.toISOString() }),
          ...(input.locationId && { location: input.locationId }),
          ...(input.batchNumber && { batchNumber: input.batchNumber }),
        });
        
        if (!updatedInventory) throw new Error('Failed to update inventory');
        inventory = updatedInventory;
        logger.debug('Inventory updated', { inventory });
      } else {
        // Create new inventory record
        logger.debug('Creating new inventory record', { 
          tenantId, 
          productId: input.productId, 
          quantity: input.quantity 
        });
        
        const newInventory = await jsonRepository.create('inventories', {
          tenantId,
          productId: input.productId,
          quantity: input.quantity,
          location: input.locationId,
          batchNumber: input.batchNumber,
          expiryDate: input.expiryDate ? input.expiryDate.toISOString() : undefined,
          lastRestocked: generateTimestamp(),
          reservedQuantity: 0,
          reorderPoint: 10,
          reorderQuantity: 100,
        });
        
        inventory = newInventory;
        logger.debug('Inventory created', { inventory });
      }

      // Create StockInLog for audit trail
      logger.debug('Creating stock in log', { 
        tenantId, 
        productId: input.productId, 
        inventoryId: inventory.id, 
        quantity: input.quantity 
      });
      
      await jsonRepository.create('stockInLogs', {
        tenantId,
        productId: input.productId,
        inventoryId: inventory.id,
        quantity: input.quantity,
        source: input.source,
        referenceId: input.referenceId,
        receivedBy: input.receivedBy,
        location: input.locationId,
        batchNumber: input.batchNumber,
        expiryDate: input.expiryDate ? input.expiryDate.toISOString() : undefined,
        notes: input.notes,
        timestamp: generateTimestamp(),
      });

      // Create stock movement record
      await jsonRepository.create('stockMovements', {
        tenantId,
        productId: input.productId,
        inventoryId: inventory.id,
        type: 'IN',
        quantity: input.quantity,
        source: input.source,
        reference: input.referenceId,
        createdBy: input.receivedBy,
      });

      // Return the updated inventory view
      return this.buildInventoryView(inventory, product);
    } catch (error) {
      logger.error('stockIn failed', { error, tenantId, input });
      throw error;
    }
  }

  /**
   * StockOut - Stock-out operation for dispatching inventory
   */
  async stockOut(tenantId: string, input: StockOutInput): Promise<InventoryView> {
    logger.debug('stockOut called', { tenantId, input });
    
    try {
      // Business Rule: Cannot dispatch zero or negative quantity
      if (input.quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }

      // Validate the product exists
      const product = await jsonRepository.findById('products', input.productId);
      if (!product || product.tenantId !== tenantId) throw new Error('Product not found');

      // Find inventory record
      const inventory = await jsonRepository.findInventoryByProductId(input.productId, tenantId);
      if (!inventory) throw new Error('Inventory record not found');

      // Check if we have enough stock
      const availableQuantity = inventory.quantity - inventory.reservedQuantity;
      if (availableQuantity < input.quantity && !input.allowNegativeStock) {
        throw new Error('Insufficient inventory');
      }

      // Update inventory quantity
      const updatedInventory = await jsonRepository.update('inventories', inventory.id, {
        quantity: inventory.quantity - input.quantity,
        lastSold: generateTimestamp(),
      });

      if (!updatedInventory) throw new Error('Failed to update inventory');

      // Create StockOutLog for audit trail
      await jsonRepository.create('stockOutLogs', {
        tenantId,
        productId: input.productId,
        inventoryId: inventory.id,
        quantity: input.quantity,
        destinationType: input.destinationType,
        referenceId: input.referenceId,
        handledBy: input.handledBy,
        locationId: input.locationId,
        notes: input.notes,
        timestamp: generateTimestamp(),
      });

      // Create stock movement record
      await jsonRepository.create('stockMovements', {
        tenantId,
        productId: input.productId,
        inventoryId: inventory.id,
        type: 'OUT',
        quantity: input.quantity,
        source: input.destinationType,
        reference: input.referenceId,
        createdBy: input.handledBy,
      });

      // Return the updated inventory view
      return this.buildInventoryView(updatedInventory, product);
    } catch (error) {
      logger.error('stockOut failed', { error, tenantId, input });
      throw error;
    }
  }

  /**
   * Adjust Stock - Manual stock adjustment with reason tracking
   */
  async adjustStock(tenantId: string, input: StockAdjustmentInput): Promise<InventoryView> {
    logger.debug('adjustStock called', { tenantId, input });
    
    try {
      // Business Rule: Cannot adjust to negative quantity
      if (input.quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }

      // Validate the product exists
      const product = await jsonRepository.findById('products', input.productId);
      if (!product || product.tenantId !== tenantId) throw new Error('Product not found');

      // Find inventory record
      const inventory = await jsonRepository.findInventoryByProductId(input.productId, tenantId);
      if (!inventory) throw new Error('Inventory record not found');

      const previousQuantity = inventory.quantity;
      let newQuantity: number;

      if (input.adjustmentType === 'increase') {
        newQuantity = previousQuantity + input.quantity;
      } else {
        newQuantity = previousQuantity - input.quantity;
        if (newQuantity < 0) {
          throw new Error('Adjustment would result in negative stock');
        }
      }

      // Update inventory
      const updatedInventory = await jsonRepository.update('inventories', inventory.id, {
        quantity: newQuantity,
      });

      if (!updatedInventory) throw new Error('Failed to update inventory');

      // Create adjustment log
      await jsonRepository.create('stockAdjustmentLogs', {
        tenantId,
        productId: input.productId,
        inventoryId: inventory.id,
        adjustmentType: input.adjustmentType,
        quantity: input.quantity,
        reason: input.reason,
        previousQuantity,
        newQuantity,
        performedBy: input.performedBy,
        timestamp: generateTimestamp(),
      });

      // Create stock movement record
      await jsonRepository.create('stockMovements', {
        tenantId,
        productId: input.productId,
        inventoryId: inventory.id,
        type: 'ADJUSTMENT',
        quantity: input.quantity,
        reason: input.reason,
        createdBy: input.performedBy,
      });

      // Return the updated inventory view
      return this.buildInventoryView(updatedInventory, product);
    } catch (error) {
      logger.error('adjustStock failed', { error, tenantId, input });
      throw error;
    }
  }

  /**
   * Get inventory by product ID
   */
  async getByProductId(tenantId: string, productId: string): Promise<InventoryView | null> {
    try {
      const inventory = await jsonRepository.findInventoryByProductId(productId, tenantId);
      if (!inventory) return null;

      const product = await jsonRepository.findById('products', productId);
      if (!product) return null;

      return this.buildInventoryView(inventory, product);
    } catch (error) {
      logger.error('getByProductId failed', { error, tenantId, productId });
      throw error;
    }
  }

  /**
   * List inventory with pagination and filtering
   */
  async list(tenantId: string, options: {
    skip: number;
    take: number;
    category?: string;
    isActive?: boolean;
  }): Promise<InventoryView[]> {
    try {
      const result = await jsonRepository.findProductsWithInventory(tenantId, {
        page: Math.floor(options.skip / options.take) + 1,
        limit: options.take,
        category: options.category,
        isActive: options.isActive,
      });

      return result.items.map(item => {
        if (!item.inventory) {
          // If no inventory exists, create a default inventory view
          return {
            id: `no-inventory-${item.id}`,
            tenantId: item.tenantId,
            productId: item.id,
            name: item.name,
            sku: item.sku,
            quantity: 0,
            reservedQuantity: 0,
            reorderPoint: 10,
            reorderQuantity: 100,
            category: item.category,
            brand: item.brand,
            attributes: item.attributes,
            location: null,
            batchNumber: null,
            expiryDate: null,
            isActive: item.isActive,
            lowStock: true,
            lastRestocked: null,
            lastSold: null,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }
        return this.buildInventoryView(item.inventory, item);
      });
    } catch (error) {
      logger.error('list failed', { error, tenantId, options });
      throw error;
    }
  }

  /**
   * Get inventory summary statistics
   */
  async getSummary(tenantId: string): Promise<{
    totalProducts: number;
    totalStock: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  }> {
    try {
      const inventories = await jsonRepository.findByTenantId('inventories', tenantId);
      
      const totalProducts = inventories.length;
      const totalStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
      const lowStockProducts = inventories.filter(inv => inv.quantity <= inv.reorderPoint).length;
      const outOfStockProducts = inventories.filter(inv => inv.quantity === 0).length;

      return {
        totalProducts,
        totalStock,
        lowStockProducts,
        outOfStockProducts,
      };
    } catch (error) {
      logger.error('getSummary failed', { error, tenantId });
      throw error;
    }
  }

  /**
   * Build InventoryView from inventory and product data
   */
  private buildInventoryView(inventory: any, product: any): InventoryView {
    return {
      id: inventory.id,
      tenantId: inventory.tenantId,
      productId: inventory.productId,
      name: product.name,
      sku: product.sku,
      quantity: inventory.quantity,
      reservedQuantity: inventory.reservedQuantity,
      reorderPoint: inventory.reorderPoint,
      reorderQuantity: inventory.reorderQuantity,
      category: product.category,
      brand: product.brand,
      attributes: product.attributes,
      location: inventory.location,
      batchNumber: inventory.batchNumber,
      expiryDate: inventory.expiryDate,
      isActive: product.isActive,
      lowStock: inventory.quantity <= inventory.reorderPoint,
      lastRestocked: inventory.lastRestocked,
      lastSold: inventory.lastSold,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    };
  }
} 