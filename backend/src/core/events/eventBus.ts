import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

export interface EventPayload {
  [key: string]: any;
}

export interface EventHandler {
  (payload: EventPayload): Promise<void> | void;
}

export class EventBus extends EventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  constructor() {
    super();
    this.setMaxListeners(0); // Allow unlimited listeners
  }

  /**
   * Register an event handler
   */
  on(event: string, handler: EventHandler): this {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
    return this;
  }

  /**
   * Register a one-time event handler
   */
  once(event: string, handler: EventHandler): this {
    const wrappedHandler = async (payload: EventPayload) => {
      try {
        await handler(payload);
        this.off(event, wrappedHandler);
      } catch (error) {
        logger.error('Error in one-time event handler', { event, error });
        this.off(event, wrappedHandler);
      }
    };
    return this.on(event, wrappedHandler);
  }

  /**
   * Emit an event to all registered handlers
   */
  emit(event: string, payload: EventPayload = {}): boolean {
    const handlers = this.handlers.get(event) || [];
    
    if (handlers.length === 0) {
      logger.debug('No handlers registered for event', { event });
      return false;
    }

    // Execute all handlers asynchronously
    handlers.forEach(async (handler) => {
      try {
        await handler(payload);
      } catch (error) {
        logger.error('Error in event handler', { event, error });
      }
    });

    logger.debug('Event emitted', { event, handlerCount: handlers.length });
    return true;
  }

  /**
   * Remove an event handler
   */
  off(event: string, handler: EventHandler): this {
    const handlers = this.handlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
    return this;
  }

  /**
   * Remove all handlers for an event
   */
  removeAllListeners(event?: string): this {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
    return this;
  }

  /**
   * Get the number of handlers for an event
   */
  listenerCount(event: string): number {
    return this.handlers.get(event)?.length || 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus(); 