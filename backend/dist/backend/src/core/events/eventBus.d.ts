import { EventEmitter } from 'events';
export interface EventPayload {
    [key: string]: any;
}
export interface EventHandler {
    (payload: EventPayload): Promise<void> | void;
}
export declare class EventBus extends EventEmitter {
    private handlers;
    constructor();
    /**
     * Register an event handler
     */
    on(event: string, handler: EventHandler): this;
    /**
     * Register a one-time event handler
     */
    once(event: string, handler: EventHandler): this;
    /**
     * Emit an event to all registered handlers
     */
    emit(event: string, payload?: EventPayload): boolean;
    /**
     * Remove an event handler
     */
    off(event: string, handler: EventHandler): this;
    /**
     * Remove all handlers for an event
     */
    removeAllListeners(event?: string): this;
    /**
     * Get the number of handlers for an event
     */
    listenerCount(event: string): number;
}
export declare const eventBus: EventBus;
//# sourceMappingURL=eventBus.d.ts.map