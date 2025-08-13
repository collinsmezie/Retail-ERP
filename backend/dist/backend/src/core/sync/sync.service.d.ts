import { EventEmitter } from 'events';
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
export declare class SyncService extends EventEmitter {
    private static instance;
    private syncQueue;
    private isSyncing;
    private syncInterval?;
    private constructor();
    static getInstance(): SyncService;
    start(): Promise<void>;
    stop(): Promise<void>;
    addToQueue(item: SyncItem): void;
    private performSync;
    private syncToCloud;
    getQueueStatus(): {
        queueLength: number;
        isSyncing: boolean;
    };
}
export declare const syncService: SyncService;
//# sourceMappingURL=sync.service.d.ts.map