// Data models for JSON storage - optimized for file-based operations

export interface Tenant {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  modules: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  category?: string;
  brand?: string;
  attributes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  tenantId: string;
  productId: string;
  quantity: number;
  location?: string;
  batchNumber?: string;
  expiryDate?: string;
  reservedQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  lastRestocked?: string;
  lastSold?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  tenantId: string;
  productId: string;
  inventoryId: string;
  type: string;
  quantity: number;
  source?: string;
  reason?: string;
  reference?: string;
  createdBy?: string;
  createdAt: string;
}

export interface StockAdjustmentLog {
  id: string;
  tenantId: string;
  productId: string;
  inventoryId: string;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: string;
  previousQuantity: number;
  newQuantity: number;
  performedBy: string;
  timestamp: string;
}

export interface StockInLog {
  id: string;
  tenantId: string;
  productId: string;
  inventoryId: string;
  quantity: number;
  source: 'supplier' | 'warehouse' | 'initial-stock';
  referenceId?: string;
  receivedBy: string;
  location?: string;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
  timestamp: string;
}

export interface StockOutLog {
  id: string;
  tenantId: string;
  productId: string;
  inventoryId: string;
  quantity: number;
  destinationType: 'customer' | 'warehouse' | 'supplier';
  referenceId?: string;
  handledBy: string;
  locationId?: string;
  notes?: string;
  timestamp: string;
}

// Collection interfaces for storing multiple records
export interface DataCollections {
  tenants: Tenant[];
  products: Product[];
  inventories: Inventory[];
  stockMovements: StockMovement[];
  stockAdjustmentLogs: StockAdjustmentLog[];
  stockInLogs: StockInLog[];
  stockOutLogs: StockOutLog[];
}

// Default collections structure
export const defaultCollections: DataCollections = {
  tenants: [],
  products: [],
  inventories: [],
  stockMovements: [],
  stockAdjustmentLogs: [],
  stockInLogs: [],
  stockOutLogs: []
};

// Utility functions for data operations
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const generateTimestamp = (): string => {
  return new Date().toISOString();
};

export const findById = <T extends { id: string }>(collection: T[], id: string): T | undefined => {
  return collection.find(item => item.id === id);
};

export const findByIds = <T extends { id: string }>(collection: T[], ids: string[]): T[] => {
  return collection.filter(item => ids.includes(item.id));
};

export const findByTenantId = <T extends { tenantId: string }>(collection: T[], tenantId: string): T[] => {
  return collection.filter(item => item.tenantId === tenantId);
};

export const findByProductId = <T extends { productId: string }>(collection: T[], productId: string): T[] => {
  return collection.filter(item => item.productId === productId);
};

export const addItem = <T extends { id: string }>(collection: T[], item: T): T[] => {
  return [...collection, item];
};

export const updateItem = <T extends { id: string }>(collection: T[], id: string, updates: Partial<T>): T[] => {
  return collection.map(item => 
    item.id === id ? { ...item, ...updates } : item
  );
};

export const removeItem = <T extends { id: string }>(collection: T[], id: string): T[] => {
  return collection.filter(item => item.id !== id);
};

export const paginate = <T>(collection: T[], page: number, limit: number): { items: T[]; total: number; page: number; limit: number } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = collection.slice(startIndex, endIndex);
  
  return {
    items,
    total: collection.length,
    page,
    limit
  };
}; 