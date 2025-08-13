import { EventEmitter } from 'events';
import { SyncItem } from './sync.service';
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
export declare class SyncQueue extends EventEmitter {
    private queue;
    private processing;
    private config;
    constructor(config?: Partial<QueueConfig>);
    enqueue(item: SyncItem, priority?: number): void;
    process(): Promise<void>;
    private processItem;
    private handleFailedItem;
    private executeSync;
    getStats(): {
        queueLength: number;
        processing: boolean;
        oldestItem?: Date;
        averagePriority: number;
    };
    clear(): void;
    getItems(): QueueItem[];
}
export declare const syncQueue: SyncQueue;
//# sourceMappingURL=sync.queue.d.ts.map