"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncQueue = exports.SyncQueue = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
class SyncQueue extends events_1.EventEmitter {
    queue = [];
    processing = false;
    config;
    constructor(config = {}) {
        super();
        this.config = {
            maxRetries: config.maxRetries || 3,
            retryDelay: config.retryDelay || 5000,
            maxPriority: config.maxPriority || 10,
            batchSize: config.batchSize || 50,
            ...config
        };
    }
    enqueue(item, priority = 5) {
        const queueItem = {
            ...item,
            retryCount: 0,
            priority: Math.min(priority, this.config.maxPriority),
            createdAt: new Date()
        };
        // Insert based on priority (higher priority first)
        const insertIndex = this.queue.findIndex(qi => qi.priority < priority);
        if (insertIndex === -1) {
            this.queue.push(queueItem);
        }
        else {
            this.queue.splice(insertIndex, 0, queueItem);
        }
        logger_1.logger.debug(`Enqueued sync item: ${item.entity} ${item.type} (priority: ${priority})`);
        this.emit('item-enqueued', queueItem);
    }
    async process() {
        if (this.processing || this.queue.length === 0) {
            return;
        }
        this.processing = true;
        const batch = this.queue.splice(0, this.config.batchSize);
        try {
            logger_1.logger.info(`Processing batch of ${batch.length} sync items`);
            for (const item of batch) {
                await this.processItem(item);
            }
            this.emit('batch-processed', batch.length);
        }
        catch (error) {
            logger_1.logger.error('Batch processing error:', error);
            this.emit('batch-error', error);
        }
        finally {
            this.processing = false;
            // Continue processing if there are more items
            if (this.queue.length > 0) {
                setTimeout(() => this.process(), 100);
            }
        }
    }
    async processItem(item) {
        try {
            const result = await this.executeSync(item);
            if (result.success) {
                this.emit('item-synced', item, result);
                logger_1.logger.debug(`Item synced successfully: ${item.entity} ${item.type}`);
            }
            else {
                await this.handleFailedItem(item, result);
            }
        }
        catch (error) {
            logger_1.logger.error(`Error processing sync item: ${item.id}`, error);
            await this.handleFailedItem(item, { success: false, message: error instanceof Error ? error.message : 'Unknown error' });
        }
    }
    async handleFailedItem(item, result) {
        item.retryCount++;
        if (item.retryCount <= this.config.maxRetries) {
            // Re-queue with exponential backoff
            const delay = this.config.retryDelay * Math.pow(2, item.retryCount - 1);
            setTimeout(() => {
                this.enqueue(item, item.priority);
            }, delay);
            logger_1.logger.warn(`Re-queuing failed item ${item.id} (attempt ${item.retryCount}/${this.config.maxRetries})`);
            this.emit('item-retry', item, result);
        }
        else {
            // Max retries exceeded
            logger_1.logger.error(`Item ${item.id} failed after ${this.config.maxRetries} retries`);
            this.emit('item-failed', item, result);
        }
    }
    async executeSync(item) {
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
    getStats() {
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
    clear() {
        this.queue = [];
        logger_1.logger.info('Sync queue cleared');
        this.emit('queue-cleared');
    }
    getItems() {
        return [...this.queue];
    }
}
exports.SyncQueue = SyncQueue;
exports.syncQueue = new SyncQueue();
//# sourceMappingURL=sync.queue.js.map