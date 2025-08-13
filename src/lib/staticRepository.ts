import { staticProducts, staticInventory, staticTenants } from '../data/staticData';
import { logger } from './logger';

export interface StaticRepository {
  findByTenantId<T>(collection: string, tenantId: string): Promise<T[]>;
  findById<T>(collection: string, id: string): Promise<T | null>;
  findInventoryByProductId(productId: string, tenantId: string): Promise<any | null>;
  create<T>(collection: string, data: T): Promise<T>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null>;
  delete(collection: string, id: string): Promise<boolean>;
}

export class StaticDataRepository implements StaticRepository {
  private collections: Map<string, any[]> = new Map();

  constructor() {
    // Initialize collections with static data
    this.collections.set('products', [...staticProducts]);
    this.collections.set('inventories', [...staticInventory]);
    this.collections.set('tenants', [...staticTenants]);
    
    logger.info('Static repository initialized with data', {
      productsCount: staticProducts.length,
      inventoryCount: staticInventory.length,
      tenantsCount: staticTenants.length
    });
  }

  async findByTenantId<T>(collection: string, tenantId: string): Promise<T[]> {
    try {
      const data = this.collections.get(collection) || [];
      const filtered = data.filter(item => item.tenantId === tenantId);
      logger.debug(`Found ${filtered.length} items in ${collection} for tenant ${tenantId}`);
      return filtered as T[];
    } catch (error) {
      logger.error(`Error finding items in ${collection} for tenant ${tenantId}`, { error });
      return [];
    }
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    try {
      const data = this.collections.get(collection) || [];
      const item = data.find(item => item.id === id);
      logger.debug(`Found item in ${collection} with id ${id}:`, item ? 'yes' : 'no');
      return item as T || null;
    } catch (error) {
      logger.error(`Error finding item in ${collection} with id ${id}`, { error });
      return null;
    }
  }

  async findInventoryByProductId(productId: string, tenantId: string): Promise<any | null> {
    try {
      const inventories = this.collections.get('inventories') || [];
      const inventory = inventories.find(inv => 
        inv.productId === productId && inv.tenantId === tenantId
      );
      logger.debug(`Found inventory for product ${productId}:`, inventory ? 'yes' : 'no');
      return inventory || null;
    } catch (error) {
      logger.error(`Error finding inventory for product ${productId}`, { error });
      return null;
    }
  }

  async create<T>(collection: string, data: T): Promise<T> {
    try {
      // In static mode, we'll simulate creation by adding to memory
      // Note: This won't persist between requests in Vercel
      const newItem = { ...data, id: this.generateId() };
      const collectionData = this.collections.get(collection) || [];
      collectionData.push(newItem);
      this.collections.set(collection, collectionData);
      
      logger.info(`Created item in ${collection}`, { id: (newItem as any).id });
      return newItem;
    } catch (error) {
      logger.error(`Error creating item in ${collection}`, { error });
      throw error;
    }
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    try {
      const collectionData = this.collections.get(collection) || [];
      const index = collectionData.findIndex(item => item.id === id);
      
      if (index === -1) {
        logger.warn(`Item not found in ${collection} with id ${id}`);
        return null;
      }

      const updatedItem = { ...collectionData[index], ...data, updatedAt: new Date().toISOString() };
      collectionData[index] = updatedItem;
      this.collections.set(collection, collectionData);
      
      logger.info(`Updated item in ${collection}`, { id });
      return updatedItem as T;
    } catch (error) {
      logger.error(`Error updating item in ${collection} with id ${id}`, { error });
      return null;
    }
  }

  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const collectionData = this.collections.get(collection) || [];
      const index = collectionData.findIndex(item => item.id === id);
      
      if (index === -1) {
        logger.warn(`Item not found in ${collection} with id ${id}`);
        return false;
      }

      collectionData.splice(index, 1);
      this.collections.set(collection, collectionData);
      
      logger.info(`Deleted item from ${collection}`, { id });
      return true;
    } catch (error) {
      logger.error(`Error deleting item from ${collection} with id ${id}`, { error });
      return false;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Method to get collection stats
  getStats() {
    const stats: Record<string, number> = {};
    for (const [collection, data] of this.collections.entries()) {
      stats[collection] = data.length;
    }
    return stats;
  }
}

// Export singleton instance
export const staticRepository = new StaticDataRepository(); 