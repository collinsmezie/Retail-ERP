// src/shared/types/inventory.types.ts

/**
 * Input for StockIn operation (enhanced stock-in)
 */
export interface StockInInput {
  productId: string;
  quantity: number;
  source: 'supplier' | 'warehouse' | 'initial-stock';
  referenceId?: string; // e.g., purchase order ID or transfer ID
  receivedBy: string; // user ID
  locationId?: string; // warehouse location
  batchNumber?: string;
  expiryDate?: Date;
  notes?: string;
}

/**
 * Input for stock-out operation (dispatching inventory)
 */
export interface StockOutInput {
  productId: string;
  quantity: number;
  destinationType: 'customer' | 'warehouse' | 'supplier';
  referenceId?: string; // e.g., sales order ID or transfer ID (optional)
  handledBy: string; // user ID who performed the dispatch
  locationId: string; // origin warehouse
  notes?: string;
  allowNegativeStock?: boolean; // optional override
}

/**
 * Flattened view model for inventory listing (joins product + inventory)
 */
export interface InventoryView {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  category?: string | null;
  brand?: string | null;
  attributes?: Record<string, any> | null;
  location?: string | null;
  batchNumber?: string | null;
  expiryDate?: Date | null;
  isActive: boolean;
  lowStock: boolean;
  lastRestocked?: Date | null;
  lastSold?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for inventory automation events
 */
export interface InventoryEventPayload {
  tenantId: string;
  productId: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT'; // Assuming these are the possible types
  reason?: string;
  triggeredBy: string;
  createdAt: Date;
}

/**
 * Input for stock adjustment operation
 */
export interface StockAdjustmentInput {
  productId: string;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: string;
  performedBy: string; // user ID
} 