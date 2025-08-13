"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncService = exports.SyncService = void 0;
const events_1 = require("events");
const app_config_1 = require("../config/app.config");
const logger_1 = require("../utils/logger");
class SyncService extends events_1.EventEmitter {
    static instance;
    syncQueue = [];
    isSyncing = false;
    syncInterval;
    constructor() {
        super();
    }
    static getInstance() {
        if (!SyncService.instance) {
            SyncService.instance = new SyncService();
        }
        return SyncService.instance;
    }
    async start() {
        if (!app_config_1.config.sync.enabled) {
            logger_1.logger.info('Sync service disabled');
            return;
        }
        logger_1.logger.info('Starting sync service');
        // Start periodic sync
        this.syncInterval = setInterval(() => {
            this.performSync();
        }, app_config_1.config.sync.interval);
        // Listen for immediate sync requests
        this.on('sync-requested', () => {
            this.performSync();
        });
    }
    async stop() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        logger_1.logger.info('Sync service stopped');
    }
    addToQueue(item) {
        this.syncQueue.push(item);
        logger_1.logger.debug(`Added item to sync queue: ${item.entity} ${item.type}`);
        // Emit event for immediate sync if needed
        if (this.syncQueue.length >= 10) {
            this.emit('sync-requested');
        }
    }
    async performSync() {
        if (this.isSyncing || this.syncQueue.length === 0) {
            return;
        }
        this.isSyncing = true;
        const itemsToSync = [...this.syncQueue];
        this.syncQueue = [];
        try {
            logger_1.logger.info(`Starting sync of ${itemsToSync.length} items`);
            const result = await this.syncToCloud(itemsToSync);
            if (result.success) {
                logger_1.logger.info(`Sync completed: ${result.syncedItems} items synced`);
                this.emit('sync-completed', result);
            }
            else {
                logger_1.logger.error(`Sync failed: ${result.message}`);
                // Re-queue failed items
                this.syncQueue.unshift(...itemsToSync);
                this.emit('sync-failed', result);
            }
        }
        catch (error) {
            logger_1.logger.error('Sync error:', error);
            // Re-queue items on error
            this.syncQueue.unshift(...itemsToSync);
            this.emit('sync-error', error);
        }
        finally {
            this.isSyncing = false;
        }
    }
    async syncToCloud(items) {
        if (!app_config_1.config.sync.cloudEndpoint) {
            return {
                success: false,
                message: 'Cloud endpoint not configured',
                errors: ['CLOUD_ENDPOINT not set']
            };
        }
        try {
            // Mock cloud sync - replace with actual implementation
            const response = await fetch(app_config_1.config.sync.cloudEndpoint, {
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
        }
        catch (error) {
            return {
                success: false,
                message: 'Cloud sync failed',
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    }
    getQueueStatus() {
        return {
            queueLength: this.syncQueue.length,
            isSyncing: this.isSyncing
        };
    }
}
exports.SyncService = SyncService;
exports.syncService = SyncService.getInstance();
//# sourceMappingURL=sync.service.js.map