"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const db_1 = require("../../../core/db");
const eventBus_1 = require("../../../core/events/eventBus");
const logger_1 = require("../../../core/utils/logger");
const sync_service_1 = require("../../../core/sync/sync.service");
class InventoryService {
    /**
     * StockIn - Enhanced stock-in operation with proper validation and logging
     */
    async stockIn(tenantId, input) {
        logger_1.logger.debug('stockIn called', { tenantId, input });
        try {
            // Business Rule: Cannot receive zero or negative quantity
            if (input.quantity <= 0) {
                throw new Error('Quantity must be greater than zero');
            }
            // Validate the product exists
            logger_1.logger.debug('Checking if product exists', { productId: input.productId, tenantId });
            const product = await db_1.prisma.product.findFirst({
                where: { id: input.productId, tenantId }
            });
            logger_1.logger.debug('Product lookup result', { product });
            if (!product)
                throw new Error('Product not found');
            // Find or create inventory record for this product
            logger_1.logger.debug('Looking for existing inventory record', { tenantId, productId: input.productId });
            let inventory = await db_1.prisma.inventory.findFirst({
                where: {
                    tenantId,
                    productId: input.productId,
                },
            });
            logger_1.logger.debug('Inventory lookup result', { inventory });
            if (inventory) {
                // Update existing inventory
                logger_1.logger.debug('Updating existing inventory quantity', {
                    inventoryId: inventory.id,
                    increment: input.quantity
                });
                inventory = await db_1.prisma.inventory.update({
                    where: { id: inventory.id },
                    data: {
                        quantity: { increment: input.quantity },
                        lastRestocked: new Date(),
                        updatedAt: new Date(),
                        ...(input.expiryDate && { expiryDate: input.expiryDate }),
                        ...(input.locationId && { location: input.locationId }),
                        ...(input.batchNumber && { batchNumber: input.batchNumber }),
                    },
                });
                logger_1.logger.debug('Inventory updated', { inventory });
            }
            else {
                // Create new inventory record
                logger_1.logger.debug('Creating new inventory record', {
                    tenantId,
                    productId: input.productId,
                    quantity: input.quantity
                });
                inventory = await db_1.prisma.inventory.create({
                    data: {
                        tenantId,
                        productId: input.productId,
                        quantity: input.quantity,
                        location: input.locationId,
                        batchNumber: input.batchNumber,
                        expiryDate: input.expiryDate,
                        lastRestocked: new Date(),
                        updatedAt: new Date(),
                    },
                });
                logger_1.logger.debug('Inventory created', { inventory });
            }
            // Create StockReceiptLog for audit trail
            logger_1.logger.debug('Creating stock receipt log', {
                tenantId,
                productId: input.productId,
                inventoryId: inventory.id,
                quantity: input.quantity
            });
            await db_1.prisma.stockInLog.create({
                data: {
                    tenantId,
                    productId: input.productId,
                    inventoryId: inventory.id,
                    quantity: input.quantity,
                    source: input.source,
                    referenceId: input.referenceId,
                    receivedBy: input.receivedBy,
                    location: input.locationId,
                    batchNumber: input.batchNumber,
                    expiryDate: input.expiryDate,
                    notes: input.notes,
                },
            });
            logger_1.logger.debug('Stock receipt log created');
            // Record stock movement for consistency
            logger_1.logger.debug('Creating stock movement record', {
                tenantId,
                productId: input.productId,
                inventoryId: inventory.id,
                quantity: input.quantity
            });
            await db_1.prisma.stockMovement.create({
                data: {
                    tenantId,
                    productId: input.productId,
                    inventoryId: inventory.id,
                    type: 'IN',
                    quantity: input.quantity,
                    source: input.source,
                    reference: input.referenceId,
                    createdBy: input.receivedBy,
                },
            });
            logger_1.logger.debug('Stock movement created');
            logger_1.logger.info(`Stocked in product: ${product.sku}`, {
                tenantId,
                productId: product.id,
                quantity: input.quantity,
                source: input.source,
                receivedBy: input.receivedBy
            });
            await eventBus_1.eventBus.emit('inventory.stock-in', {
                tenantId,
                productId: product.id,
                quantity: input.quantity,
                type: 'IN',
                triggeredBy: input.receivedBy,
                createdAt: new Date()
            });
            sync_service_1.syncService.addToQueue({
                id: inventory.id,
                type: 'update',
                entity: 'inventory',
                data: inventory,
                tenantId,
                timestamp: new Date()
            });
            logger_1.logger.debug('Returning inventory view', { inventory, product });
            return this.toInventoryView(inventory, product);
        }
        catch (error) {
            logger_1.logger.error('Failed to stock in (service)', {
                error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
                tenantId,
                input
            });
            throw error;
        }
    }
    /**
     * Stock out (dispatch inventory for sales, transfers, returns)
     */
    async stockOut(tenantId, stockOut) {
        // Validate product
        const product = await db_1.prisma.product.findFirst({ where: { id: stockOut.productId, tenantId } });
        if (!product)
            throw new Error('Product not found');
        // Validate inventory
        const inventory = await db_1.prisma.inventory.findFirst({ where: { tenantId, productId: stockOut.productId } });
        if (!inventory)
            throw new Error('Inventory record not found');
        // Validate quantity
        if (!stockOut.allowNegativeStock && inventory.quantity < stockOut.quantity) {
            throw new Error('Insufficient inventory');
        }
        // Subtract quantity
        const updatedInventory = await db_1.prisma.inventory.update({
            where: { id: inventory.id },
            data: {
                quantity: { decrement: stockOut.quantity },
                lastSold: new Date(),
                updatedAt: new Date(),
            },
        });
        // Create StockOutLog
        await db_1.prisma.stockOutLog.create({
            data: {
                tenantId,
                productId: stockOut.productId,
                inventoryId: inventory.id,
                quantity: stockOut.quantity,
                destinationType: stockOut.destinationType,
                referenceId: stockOut.referenceId,
                handledBy: stockOut.handledBy,
                locationId: stockOut.locationId,
                notes: stockOut.notes,
                timestamp: new Date(),
            },
        });
        // Record stock movement (for audit trail)
        await db_1.prisma.stockMovement.create({
            data: {
                tenantId,
                productId: stockOut.productId,
                inventoryId: inventory.id,
                type: 'OUT',
                quantity: -stockOut.quantity,
                source: stockOut.destinationType,
                reference: stockOut.referenceId,
                createdBy: stockOut.handledBy,
            },
        });
        // Optionally: trigger reorder check if below reorder point
        if ((updatedInventory.quantity - updatedInventory.reservedQuantity) <= updatedInventory.reorderPoint) {
            logger_1.logger.info('Inventory below reorder point', {
                tenantId,
                productId: stockOut.productId,
                quantity: updatedInventory.quantity,
                reorderPoint: updatedInventory.reorderPoint,
            });
            // TODO: trigger reorder workflow/event if needed
        }
        logger_1.logger.info('Stocked out product', {
            tenantId,
            productId: stockOut.productId,
            quantity: stockOut.quantity,
            destinationType: stockOut.destinationType,
            referenceId: stockOut.referenceId,
            handledBy: stockOut.handledBy,
            locationId: stockOut.locationId,
        });
        await eventBus_1.eventBus.emit('inventory.stock-out', {
            tenantId,
            productId: stockOut.productId,
            quantity: -stockOut.quantity,
            type: 'OUT',
            triggeredBy: stockOut.handledBy,
            createdAt: new Date(),
        });
        sync_service_1.syncService.addToQueue({
            id: inventory.id,
            type: 'update',
            entity: 'inventory',
            data: updatedInventory,
            tenantId,
            timestamp: new Date(),
        });
        return this.toInventoryView(updatedInventory, product);
    }
    /**
     * Get inventory by product ID
     */
    async getByProductId(tenantId, productId) {
        const inventory = await db_1.prisma.inventory.findFirst({ where: { tenantId, productId } });
        if (!inventory)
            return null;
        const product = await db_1.prisma.product.findFirst({ where: { id: productId, tenantId } });
        if (!product)
            return null;
        return this.toInventoryView(inventory, product);
    }
    /**
     * List all inventory for a tenant (optionally filter by category, isActive, etc.)
     */
    async list(tenantId, options) {
        console.log('InventoryService.list called', { tenantId, options });
        const inventories = await db_1.prisma.inventory.findMany({
            where: { tenantId },
            skip: options?.skip,
            take: options?.take,
        });
        console.log('Inventories found', { count: inventories.length, inventories });
        const productIds = inventories.map((i) => i.productId);
        console.log('Product IDs from inventories', { productIds });
        const products = await db_1.prisma.product.findMany({ where: { id: { in: productIds }, tenantId } });
        console.log('Products found', { count: products.length, products });
        const result = inventories.map((inv) => {
            const prod = products.find((p) => p.id === inv.productId);
            return prod ? this.toInventoryView(inv, prod) : null;
        }).filter(Boolean);
        console.log('Final mapped inventory views', { count: result.length, result });
        return result;
    }
    /**
     * Adjust inventory quantity for a product (manual/system correction)
     */
    async adjustStock(tenantId, adjustment, allowNegativeStock = false) {
        // Validate product
        const product = await db_1.prisma.product.findFirst({ where: { id: adjustment.productId, tenantId } });
        if (!product)
            throw new Error('Product not found');
        // Find inventory
        const inventory = await db_1.prisma.inventory.findFirst({ where: { tenantId, productId: adjustment.productId } });
        if (!inventory)
            throw new Error('Inventory record not found');
        const previousQuantity = inventory.quantity;
        let newQuantity = previousQuantity;
        if (adjustment.adjustmentType === 'increase') {
            newQuantity += adjustment.quantity;
        }
        else if (adjustment.adjustmentType === 'decrease') {
            if (!allowNegativeStock && previousQuantity < adjustment.quantity) {
                throw new Error('Insufficient inventory for adjustment');
            }
            newQuantity -= adjustment.quantity;
        }
        else {
            throw new Error('Invalid adjustment type');
        }
        // Update inventory
        const updated = await db_1.prisma.inventory.update({
            where: { id: inventory.id },
            data: {
                quantity: newQuantity,
                updatedAt: new Date(),
            },
        });
        // Log adjustment
        await db_1.prisma.stockAdjustmentLog.create({
            data: {
                tenantId,
                productId: adjustment.productId,
                inventoryId: inventory.id,
                adjustmentType: adjustment.adjustmentType,
                quantity: adjustment.quantity,
                reason: adjustment.reason,
                previousQuantity,
                newQuantity,
                performedBy: adjustment.performedBy,
                timestamp: new Date(),
            },
        });
        logger_1.logger.info('Stock adjusted', { tenantId, productId: adjustment.productId, adjustmentType: adjustment.adjustmentType, quantity: adjustment.quantity, reason: adjustment.reason, performedBy: adjustment.performedBy });
        return this.toInventoryView(updated, product);
    }
    /**
     * Helper to flatten inventory + product into InventoryView
     */
    toInventoryView(inv, prod) {
        return {
            id: inv.id,
            tenantId: inv.tenantId,
            productId: inv.productId,
            name: prod.name,
            sku: prod.sku,
            quantity: inv.quantity,
            reservedQuantity: inv.reservedQuantity,
            reorderPoint: inv.reorderPoint,
            reorderQuantity: inv.reorderQuantity,
            category: prod.category,
            brand: prod.brand,
            attributes: prod.attributes,
            location: inv.location,
            batchNumber: inv.batchNumber,
            expiryDate: inv.expiryDate,
            isActive: prod.isActive,
            lowStock: (inv.quantity - inv.reservedQuantity) <= inv.reorderPoint,
            lastRestocked: inv.lastRestocked,
            lastSold: inv.lastSold,
            createdAt: inv.createdAt,
            updatedAt: inv.updatedAt,
        };
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map