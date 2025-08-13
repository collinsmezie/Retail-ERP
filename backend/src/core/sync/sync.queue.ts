import { EventEmitter } from 'events';
import { SyncItem, SyncResult } from './sync.service';
import { logger } from '../utils/logger';

export interface QueueItem extends SyncItem {
  retryCount: number;
  priority: number;
  createdAt: Date;
}

export interface QueueConfig {
  maxRetries: number;
  retryDelay: number;
  maxPriority: number;
  batchSize: number;
}

export class SyncQueue extends EventEmitter {
  private queue: QueueItem[] = [];
  private processing = false;
  private config: QueueConfig;

  constructor(config: Partial<QueueConfig> = {}) {
    super();
    this.config = {
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 5000,
      maxPriority: config.maxPriority || 10,
      batchSize: config.batchSize || 50,
      ...config
    };
  }

  enqueue(item: SyncItem, priority: number = 5): void {
    const queueItem: QueueItem = {
      ...item,
      retryCount: 0,
      priority: Math.min(priority, this.config.maxPriority),
      createdAt: new Date()
    };

    // Insert based on priority (higher priority first)
    const insertIndex = this.queue.findIndex(qi => qi.priority < priority);
    if (insertIndex === -1) {
      this.queue.push(queueItem);
    } else {
      this.queue.splice(insertIndex, 0, queueItem);
    }

    logger.debug(`Enqueued sync item: ${item.entity} ${item.type} (priority: ${priority})`);
    this.emit('item-enqueued', queueItem);
  }

  async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const batch = this.queue.splice(0, this.config.batchSize);

    try {
      logger.info(`Processing batch of ${batch.length} sync items`);
      
      for (const item of batch) {
        await this.processItem(item);
      }

      this.emit('batch-processed', batch.length);
    } catch (error) {
      logger.error('Batch processing error:', error);
      this.emit('batch-error', error);
    } finally {
      this.processing = false;
      
      // Continue processing if there are more items
      if (this.queue.length > 0) {
        setTimeout(() => this.process(), 100);
      }
    }
  }

  private async processItem(item: QueueItem): Promise<void> {
    try {
      const result = await this.executeSync(item);
      
      if (result.success) {
        this.emit('item-synced', item, result);
        logger.debug(`Item synced successfully: ${item.entity} ${item.type}`);
      } else {
        await this.handleFailedItem(item, result);
      }
    } catch (error) {
      logger.error(`Error processing sync item: ${item.id}`, error);
      await this.handleFailedItem(item, { success: false, message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private async handleFailedItem(item: QueueItem, result: SyncResult): Promise<void> {
    item.retryCount++;

    if (item.retryCount <= this.config.maxRetries) {
      // Re-queue with exponential backoff
      const delay = this.config.retryDelay * Math.pow(2, item.retryCount - 1);
      
      setTimeout(() => {
        this.enqueue(item, item.priority);
      }, delay);

      logger.warn(`Re-queuing failed item ${item.id} (attempt ${item.retryCount}/${this.config.maxRetries})`);
      this.emit('item-retry', item, result);
    } else {
      // Max retries exceeded
      logger.error(`Item ${item.id} failed after ${this.config.maxRetries} retries`);
      this.emit('item-failed', item, result);
    }
  }

  private async executeSync(_item: QueueItem): Promise<SyncResult> {
    // Mock sync execution - replace with actual sync logic
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        resolve({
          success,
          message: success ? 'Sync completed' : 'Sync failed',
          syncedItems: success ? 1 : 0
        });
      }, 100);
    });
  }

  getStats(): {
    queueLength: number;
    processing: boolean;
    oldestItem?: Date;
    averagePriority: number;
  } {
    const oldestItem = this.queue.length > 0 ? this.queue[this.queue.length - 1].createdAt : undefined;
    const averagePriority = this.queue.length > 0 
      ? this.queue.reduce((sum, item) => sum + item.priority, 0) / this.queue.length 
      : 0;

    return {
      queueLength: this.queue.length,
      processing: this.processing,
      oldestItem,
      averagePriority
    };
  }

  clear(): void {
    this.queue = [];
    logger.info('Sync queue cleared');
    this.emit('queue-cleared');
  }

  getItems(): QueueItem[] {
    return [...this.queue];
  }
}

export const syncQueue = new SyncQueue(); 