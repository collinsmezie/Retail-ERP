import { InventoryView, StockOutInput, StockAdjustmentInput, StockInInput } from '../../../../../shared/types/inventory.types';
export declare class InventoryService {
    /**
     * StockIn - Enhanced stock-in operation with proper validation and logging
     */
    stockIn(tenantId: string, input: StockInInput): Promise<InventoryView>;
    /**
     * Stock out (dispatch inventory for sales, transfers, returns)
     */
    stockOut(tenantId: string, stockOut: StockOutInput): Promise<InventoryView>;
    /**
     * Get inventory by product ID
     */
    getByProductId(tenantId: string, productId: string): Promise<InventoryView | null>;
    /**
     * List all inventory for a tenant (optionally filter by category, isActive, etc.)
     */
    list(tenantId: string, options?: {
        category?: string;
        isActive?: boolean;
        skip?: number;
        take?: number;
    }): Promise<InventoryView[]>;
    /**
     * Adjust inventory quantity for a product (manual/system correction)
     */
    adjustStock(tenantId: string, adjustment: StockAdjustmentInput, allowNegativeStock?: boolean): Promise<InventoryView>;
    /**
     * Helper to flatten inventory + product into InventoryView
     */
    private toInventoryView;
}
//# sourceMappingURL=inventory.service.d.ts.map