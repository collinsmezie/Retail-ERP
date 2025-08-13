"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automationConfig = exports.AutomationConfig = void 0;
class AutomationConfig {
    static instance;
    rules = new Map();
    constructor() {
        this.loadDefaultRules();
    }
    static getInstance() {
        if (!AutomationConfig.instance) {
            AutomationConfig.instance = new AutomationConfig();
        }
        return AutomationConfig.instance;
    }
    loadDefaultRules() {
        // Low stock alert rule
        this.addRule({
            id: 'low-stock-alert',
            name: 'Low Stock Alert',
            description: 'Send notification when inventory falls below threshold',
            trigger: {
                event: 'inventory.updated',
                conditions: { quantity: { $lt: 10 } }
            },
            actions: [{
                    type: 'send-notification',
                    config: {
                        type: 'email',
                        recipients: ['manager@store.com'],
                        template: 'low-stock-alert'
                    }
                }],
            enabled: true,
            priority: 1,
            module: 'inventory'
        });
    }
    addRule(rule) {
        this.rules.set(rule.id, rule);
    }
    getRulesByEvent(event) {
        return Array.from(this.rules.values()).filter(rule => rule.enabled && rule.trigger.event === event);
    }
    getAllRules() {
        return Array.from(this.rules.values());
    }
}
exports.AutomationConfig = AutomationConfig;
exports.automationConfig = AutomationConfig.getInstance();
//# sourceMappingURL=automation.config.js.map