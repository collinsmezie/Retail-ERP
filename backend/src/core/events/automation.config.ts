export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    event: string;
    conditions?: Record<string, any>;
  };
  actions: AutomationAction[];
  enabled: boolean;
  priority: number;
  module: string;
}

export interface AutomationAction {
  type: 'emit-event' | 'send-notification' | 'update-record' | 'webhook' | 'email';
  config: Record<string, any>;
  delay?: number;
}

export class AutomationConfig {
  private static instance: AutomationConfig;
  private rules: Map<string, AutomationRule> = new Map();

  private constructor() {
    this.loadDefaultRules();
  }

  static getInstance(): AutomationConfig {
    if (!AutomationConfig.instance) {
      AutomationConfig.instance = new AutomationConfig();
    }
    return AutomationConfig.instance;
  }

  private loadDefaultRules(): void {
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

  addRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule);
  }

  getRulesByEvent(event: string): AutomationRule[] {
    return Array.from(this.rules.values()).filter(rule => 
      rule.enabled && rule.trigger.event === event
    );
  }

  getAllRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }
}

export const automationConfig = AutomationConfig.getInstance(); 