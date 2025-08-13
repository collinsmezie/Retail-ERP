import { EventEmitter } from 'events';
import { config } from '../config/app.config';
import { logger } from '../utils/logger';

export interface SyncItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  tenantId: string;
  timestamp: Date;
}

export interface SyncResult {
  success: boolean;
  message: string;
  syncedItems?: number;
  errors?: string[];
}

export class SyncService extends EventEmitter {
  private static instance: SyncService;
  private syncQueue: SyncItem[] = [];
  private isSyncing = false;
  private syncInterval?: NodeJS.Timeout;

  private constructor() {
    super();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async start(): Promise<void> {
    if (!config.sync.enabled) {
      logger.info('Sync service disabled');
      return;
    }

    logger.info('Starting sync service');
    
    // Start periodic sync
    this.syncInterval = setInterval(() => {
      this.performSync();
    }, config.sync.interval);

    // Listen for immediate sync requests
    this.on('sync-requested', () => {
      this.performSync();
    });
  }

  async stop(): Promise<void> {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    logger.info('Sync service stopped');
  }

  addToQueue(item: SyncItem): void {
    this.syncQueue.push(item);
    logger.debug(`Added item to sync queue: ${item.entity} ${item.type}`);
    
    // Emit event for immediate sync if needed
    if (this.syncQueue.length >= 10) {
      this.emit('sync-requested');
    }
  }

  private async performSync(): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;
    const itemsToSync = [...this.syncQueue];
    this.syncQueue = [];

    try {
      logger.info(`Starting sync of ${itemsToSync.length} items`);
      
      const result = await this.syncToCloud(itemsToSync);
      
      if (result.success) {
        logger.info(`Sync completed: ${result.syncedItems} items synced`);
        this.emit('sync-completed', result);
      } else {
        logger.error(`Sync failed: ${result.message}`);
        // Re-queue failed items
        this.syncQueue.unshift(...itemsToSync);
        this.emit('sync-failed', result);
      }
    } catch (error) {
      logger.error('Sync error:', error);
      // Re-queue items on error
      this.syncQueue.unshift(...itemsToSync);
      this.emit('sync-error', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncToCloud(items: SyncItem[]): Promise<SyncResult> {
    if (!config.sync.cloudEndpoint) {
      return {
        success: false,
        message: 'Cloud endpoint not configured',
        errors: ['CLOUD_ENDPOINT not set']
      };
    }

    try {
      // Mock cloud sync - replace with actual implementation
      const response = await fetch(config.sync.cloudEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CLOUD_API_KEY || ''}`
        },
        body: JSON.stringify({
          items,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Cloud sync failed: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'Sync completed successfully',
        syncedItems: items.length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Cloud sync failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  getQueueStatus(): { queueLength: number; isSyncing: boolean } {
    return {
      queueLength: this.syncQueue.length,
      isSyncing: this.isSyncing
    };
  }
}

export const syncService = SyncService.getInstance(); 