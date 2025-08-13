"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = exports.EventBus = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
class EventBus extends events_1.EventEmitter {
    handlers = new Map();
    constructor() {
        super();
        this.setMaxListeners(0); // Allow unlimited listeners
    }
    /**
     * Register an event handler
     */
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event).push(handler);
        return this;
    }
    /**
     * Register a one-time event handler
     */
    once(event, handler) {
        const wrappedHandler = async (payload) => {
            try {
                await handler(payload);
                this.off(event, wrappedHandler);
            }
            catch (error) {
                logger_1.logger.error('Error in one-time event handler', { event, error });
                this.off(event, wrappedHandler);
            }
        };
        return this.on(event, wrappedHandler);
    }
    /**
     * Emit an event to all registered handlers
     */
    emit(event, payload = {}) {
        const handlers = this.handlers.get(event) || [];
        if (handlers.length === 0) {
            logger_1.logger.debug('No handlers registered for event', { event });
            return false;
        }
        // Execute all handlers asynchronously
        handlers.forEach(async (handler) => {
            try {
                await handler(payload);
            }
            catch (error) {
                logger_1.logger.error('Error in event handler', { event, error });
            }
        });
        logger_1.logger.debug('Event emitted', { event, handlerCount: handlers.length });
        return true;
    }
    /**
     * Remove an event handler
     */
    off(event, handler) {
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
    removeAllListeners(event) {
        if (event) {
            this.handlers.delete(event);
        }
        else {
            this.handlers.clear();
        }
        return this;
    }
    /**
     * Get the number of handlers for an event
     */
    listenerCount(event) {
        return this.handlers.get(event)?.length || 0;
    }
}
exports.EventBus = EventBus;
// Export singleton instance
exports.eventBus = new EventBus();
//# sourceMappingURL=eventBus.js.map