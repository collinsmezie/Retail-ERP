import app from './src/index';
import { config } from './src/core/config/app.config';
import { connectDb, disconnectDb } from './src/core/db';
import { syncService } from './src/core/sync/sync.service';
import { logger } from './src/core/utils/logger';

let server: any;

async function initialize() {
  logger.info('Initializing Retail ERP application...');
  await connectDb();
  logger.info('Database initialized successfully');
  await syncService.start();
  logger.info('Sync service started');
  logger.info('Application initialization completed');
}

async function start() {
  try {
    await initialize();
    server = app.listen(config.server.port, config.server.host, () => {
      logger.info(`Retail ERP server started`, {
        host: config.server.host,
        port: config.server.port,
        environment: config.server.environment
      });
    });
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start application', { error });
    throw error;
  }
}

async function shutdown() {
  logger.info('Shutting down Retail ERP application...');
  try {
    await syncService.stop();
    logger.info('Sync service stopped');
    await disconnectDb();
    logger.info('Database connection closed');
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error during shutdown', { error });
    process.exit(1);
  }
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export { app, start };