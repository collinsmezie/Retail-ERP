import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  url: string;
  logging: boolean;
}

export interface ServerConfig {
  port: number;
  host: string;
  environment: string;
}

export interface SyncConfig {
  enabled: boolean;
  interval: number;
  cloudEndpoint?: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  sync: SyncConfig;
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const config: AppConfig = {
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    logging: process.env.NODE_ENV !== 'production',
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development',
  },
  sync: {
    enabled: process.env.SYNC_ENABLED === 'true',
    interval: parseInt(process.env.SYNC_INTERVAL || '300000'), // 5 minutes
    cloudEndpoint: process.env.CLOUD_ENDPOINT,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};

export default config; 