"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const db_1 = require("../db");
class TenantMiddleware {
    static async resolveTenant(req, res, next) {
        try {
            // Extract tenant from header, subdomain, or custom header
            const tenantCode = req.headers['x-tenant'] ||
                req.headers['x-tenant-id'] ||
                req.headers['tenant-id'] ||
                TenantMiddleware.extractFromSubdomain(req);
            console.log('Tenant middleware - tenantCode:', tenantCode);
            if (!tenantCode) {
                res.status(401).json({ error: 'Tenant ID required' });
                return;
            }
            // In a real implementation, you'd fetch tenant info from database
            const tenant = await TenantMiddleware.getTenantInfo(tenantCode);
            console.log('Tenant middleware - tenant lookup result:', tenant);
            if (!tenant || !tenant.isActive) {
                res.status(403).json({ error: 'Invalid or inactive tenant' });
                return;
            }
            req.tenant = tenant;
            console.log('Resolved tenant context:', tenant);
            next();
        }
        catch (error) {
            console.error('Tenant resolution error:', error);
            res.status(500).json({ error: 'Tenant resolution failed' });
        }
    }
    static extractFromSubdomain(req) {
        const host = req.get('host');
        if (!host)
            return null;
        const subdomain = host.split('.')[0];
        return subdomain !== 'www' && subdomain !== 'api' ? subdomain : null;
    }
    static async getTenantInfo(tenantCode) {
        // Fetch tenant from database
        const tenant = await db_1.prisma.tenant.findFirst({ where: { code: tenantCode } });
        if (!tenant)
            return null;
        return {
            tenantId: tenant.id, // UUID
            tenantCode: tenant.code,
            tenantName: tenant.name,
            isActive: tenant.isActive,
            modules: tenant.modules.split(',').map(m => m.trim()),
        };
    }
    static requireModule(moduleName) {
        return (req, res, next) => {
            if (!req.tenant) {
                res.status(401).json({ error: 'Tenant context required' });
                return;
            }
            if (!req.tenant.modules.includes(moduleName)) {
                res.status(403).json({ error: `Module '${moduleName}' not available for this tenant` });
                return;
            }
            next();
        };
    }
}
exports.TenantMiddleware = TenantMiddleware;
//# sourceMappingURL=tenant.middleware.js.map