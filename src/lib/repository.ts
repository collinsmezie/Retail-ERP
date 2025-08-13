import { jsonStorage } from './jsonStorage';
import { 
  DataCollections, 
  defaultCollections,
  generateId,
  generateTimestamp,
  findById,
  findByTenantId,
  findByProductId,
  addItem,
  updateItem,
  removeItem,
  paginate
} from './models';
import { logger } from './logger';

export class JsonRepository {
  private collections: DataCollections;
  private initialized: boolean = false;

  constructor() {
    this.collections = { ...defaultCollections };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Try to load existing data
      const data = await jsonStorage.read<DataCollections>('data');
      if (data) {
        this.collections = data;
        logger.info('Loaded existing data from JSON storage');
      } else {
        // Create default data if none exists
        await this.createDefaultData();
        logger.info('Created default data for new installation');
      }
      
      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize repository', { error });
      throw error;
    }
  }

  private async createDefaultData(): Promise<void> {
    const defaultTenant = {
      id: generateId(),
      code: 'tenant1',
      name: 'Default Tenant',
      isActive: true,
      modules: 'inventory,product,sales',
      createdAt: generateTimestamp(),
      updatedAt: generateTimestamp()
    };

    this.collections.tenants = [defaultTenant];
    await this.saveAll();
  }

  private async saveAll(): Promise<void> {
    await jsonStorage.write('data', this.collections);
  }

  // Generic CRUD operations
  async create<T extends keyof DataCollections>(
    collection: T,
    data: Omit<DataCollections[T][0], 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DataCollections[T][0]> {
    await this.initialize();
    
    const newItem = {
      ...data,
      id: generateId(),
      createdAt: generateTimestamp(),
      updatedAt: generateTimestamp()
    } as DataCollections[T][0];

    this.collections[collection] = addItem(
      this.collections[collection] as any[],
      newItem
    ) as any;

    await this.saveAll();
    return newItem;
  }

  async findById<T extends keyof DataCollections>(
    collection: T,
    id: string
  ): Promise<DataCollections[T][0] | null> {
    await this.initialize();
    
    const item = findById(this.collections[collection] as any[], id);
    return item || null;
  }

  async findByTenantId<T extends keyof DataCollections>(
    collection: T,
    tenantId: string
  ): Promise<DataCollections[T][0][]> {
    await this.initialize();
    
    return findByTenantId(this.collections[collection] as any[], tenantId);
  }

  async findByProductId<T extends keyof DataCollections>(
    collection: T,
    productId: string
  ): Promise<DataCollections[T][0][]> {
    await this.initialize();
    
    return findByProductId(this.collections[collection] as any[], productId);
  }

  async update<T extends keyof DataCollections>(
    collection: T,
    id: string,
    updates: Partial<DataCollections[T][0]>
  ): Promise<DataCollections[T][0] | null> {
    await this.initialize();
    
    const existingItem = findById(this.collections[collection] as any[], id);
    if (!existingItem) return null;

    const updatedItem = {
      ...existingItem,
      ...updates,
      updatedAt: generateTimestamp()
    } as DataCollections[T][0];

    this.collections[collection] = updateItem(
      this.collections[collection] as any[],
      id,
      updatedItem
    ) as any;

    await this.saveAll();
    return updatedItem;
  }

  async delete<T extends keyof DataCollections>(
    collection: T,
    id: string
  ): Promise<boolean> {
    await this.initialize();
    
    const existingItem = findById(this.collections[collection] as any[], id);
    if (!existingItem) return false;

    this.collections[collection] = removeItem(
      this.collections[collection] as any[],
      id
    ) as any;

    await this.saveAll();
    return true;
  }

  async list<T extends keyof DataCollections>(
    collection: T,
    options?: {
      page?: number;
      limit?: number;
      tenantId?: string;
      productId?: string;
    }
  ): Promise<{
    items: DataCollections[T][0][];
    total: number;
    page: number;
    limit: number;
  }> {
    await this.initialize();
    
    let items = [...this.collections[collection]] as DataCollections[T][0][];

    // Apply filters
    if (options?.tenantId) {
      items = findByTenantId(items as any[], options.tenantId) as any;
    }
    
    if (options?.productId) {
      items = findByProductId(items as any[], options.productId) as any;
    }

    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    
    return paginate(items, page, limit);
  }

  async count<T extends keyof DataCollections>(
    collection: T,
    tenantId?: string
  ): Promise<number> {
    await this.initialize();
    
    let items = this.collections[collection] as any[];
    
    if (tenantId) {
      items = findByTenantId(items, tenantId);
    }
    
    return items.length;
  }

  async exists<T extends keyof DataCollections>(
    collection: T,
    id: string
  ): Promise<boolean> {
    await this.initialize();
    
    return findById(this.collections[collection] as any[], id) !== undefined;
  }

  // Specialized methods for complex operations
  async findInventoryByProductId(productId: string, tenantId: string): Promise<any | null> {
    await this.initialize();
    
    const inventory = this.collections.inventories.find(
      inv => inv.productId === productId && inv.tenantId === tenantId
    );
    
    if (!inventory) return null;

    // Get product details
    const product = this.collections.products.find(p => p.id === productId);
    
    return {
      ...inventory,
      product: product || null
    };
  }

  async findProductsWithInventory(tenantId: string, options?: {
    page?: number;
    limit?: number;
    category?: string;
    isActive?: boolean;
  }): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    await this.initialize();
    
    let products = this.collections.products.filter(p => p.tenantId === tenantId);
    
    // Apply filters
    if (options?.category) {
      products = products.filter(p => p.category === options.category);
    }
    
    if (options?.isActive !== undefined) {
      products = products.filter(p => p.isActive === options.isActive);
    }

    // Join with inventory data
    const productsWithInventory = products.map(product => {
      const inventory = this.collections.inventories.find(
        inv => inv.productId === product.id && inv.tenantId === tenantId
      );
      
      return {
        ...product,
        inventory: inventory || null
      };
    });

    // Apply pagination
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    
    return paginate(productsWithInventory, page, limit);
  }

  // Backup and restore operations
  async createBackup(): Promise<string> {
    await this.initialize();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `backup_${timestamp}`;
    
    await jsonStorage.write(backupFilename, this.collections);
    return backupFilename;
  }

  async restoreFromBackup(backupFilename: string): Promise<void> {
    const backupData = await jsonStorage.read<DataCollections>(backupFilename);
    if (!backupData) {
      throw new Error(`Backup file ${backupFilename} not found`);
    }
    
    this.collections = backupData;
    await this.saveAll();
    logger.info(`Restored data from backup: ${backupFilename}`);
  }

  // Get storage statistics
  async getStats(): Promise<{
    collections: Record<string, number>;
    storage: any;
  }> {
    await this.initialize();
    
    const collections = {
      tenants: this.collections.tenants.length,
      products: this.collections.products.length,
      inventories: this.collections.inventories.length,
      stockMovements: this.collections.stockMovements.length,
      stockAdjustmentLogs: this.collections.stockAdjustmentLogs.length,
      stockInLogs: this.collections.stockInLogs.length,
      stockOutLogs: this.collections.stockOutLogs.length
    };

    const storage = await jsonStorage.getStats();
    
    return { collections, storage };
  }
}

// Create and export the repository instance
export const jsonRepository = new JsonRepository(); 