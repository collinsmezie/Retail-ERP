import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './core/config/app.config';
import { logger } from './core/utils/logger';
import { inventoryRoutes } from './modules/inventory/routes/inventory.routes';
import { productRoutes } from './modules/product/routes/product.routes';
import './core/tenancy/tenant.middleware';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    tenantId: req.headers['x-tenant-id']
  });
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: config.server.environment
  });
});

// API routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', { error, path: req.path });
  res.status(500).json({ error: 'Internal server error' });
});

export default app; 