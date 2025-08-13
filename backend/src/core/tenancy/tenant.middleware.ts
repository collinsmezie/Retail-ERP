import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

export interface TenantContext {
  tenantId: string; // UUID
  tenantCode: string; // code, e.g. 'tenant1'
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

export class TenantMiddleware {
  static async resolveTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract tenant from header, subdomain, or custom header
      const tenantCode = req.headers['x-tenant'] as string || 
                      req.headers['x-tenant-id'] as string || 
                      req.headers['tenant-id'] as string ||
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
    } catch (error) {
      console.error('Tenant resolution error:', error);
      res.status(500).json({ error: 'Tenant resolution failed' });
    }
  }

  private static extractFromSubdomain(req: Request): string | null {
    const host = req.get('host');
    if (!host) return null;
    
    const subdomain = host.split('.')[0];
    return subdomain !== 'www' && subdomain !== 'api' ? subdomain : null;
  }

  private static async getTenantInfo(tenantCode: string): Promise<TenantContext | null> {
    // Fetch tenant from database
    const tenant = await prisma.tenant.findFirst({ where: { code: tenantCode } });
    if (!tenant) return null;
    return {
      tenantId: tenant.id, // UUID
      tenantCode: tenant.code,
      tenantName: tenant.name,
      isActive: tenant.isActive,
      modules: tenant.modules.split(',').map(m => m.trim()),
    };
  }

  static requireModule(moduleName: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
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