import { Request, Response, NextFunction } from 'express';
export interface TenantContext {
    tenantId: string;
    tenantCode: string;
    tenantName: string;
    isActive: boolean;
    modules: string[];
}
declare global {
    namespace Express {
        interface Request {
            tenant?: TenantContext;
        }
    }
}
export declare class TenantMiddleware {
    static resolveTenant(req: Request, res: Response, next: NextFunction): Promise<void>;
    private static extractFromSubdomain;
    private static getTenantInfo;
    static requireModule(moduleName: string): (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=tenant.middleware.d.ts.map