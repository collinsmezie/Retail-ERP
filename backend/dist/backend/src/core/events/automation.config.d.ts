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
export declare class AutomationConfig {
    private static instance;
    private rules;
    private constructor();
    static getInstance(): AutomationConfig;
    private loadDefaultRules;
    addRule(rule: AutomationRule): void;
    getRulesByEvent(event: string): AutomationRule[];
    getAllRules(): AutomationRule[];
}
export declare const automationConfig: AutomationConfig;
//# sourceMappingURL=automation.config.d.ts.map