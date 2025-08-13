import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger';

export interface JsonStorageConfig {
  dataDir: string;
  backupDir: string;
  autoBackup: boolean;
  backupInterval: number; // in milliseconds
}

export class JsonStorage {
  private config: JsonStorageConfig;
  private dataPath: string;
  private backupPath: string;
  private backupTimer?: NodeJS.Timeout;

  constructor(config: JsonStorageConfig) {
    this.config = config;
    this.dataPath = path.resolve(config.dataDir);
    this.backupPath = path.resolve(config.backupDir);
    this.ensureDirectories();
  }

  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      await fs.mkdir(this.backupPath, { recursive: true });
    } catch (error) {
      logger.error('Failed to create storage directories', { error });
      throw error;
    }
  }

  async read<T>(filename: string): Promise<T | null> {
    try {
      const filePath = path.join(this.dataPath, `${filename}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null; // File doesn't exist
      }
      logger.error(`Failed to read ${filename}`, { error });
      throw error;
    }
  }

  async write<T>(filename: string, data: T): Promise<void> {
    try {
      const filePath = path.join(this.dataPath, `${filename}.json`);
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf-8');
      
      if (this.config.autoBackup) {
        await this.createBackup(filename, data);
      }
    } catch (error) {
      logger.error(`Failed to write ${filename}`, { error });
      throw error;
    }
  }

  async delete(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.dataPath, `${filename}.json`);
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return; // File doesn't exist
      }
      logger.error(`Failed to delete ${filename}`, { error });
      throw error;
    }
  }

  async exists(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.dataPath, `${filename}.json`);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.dataPath);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      logger.error('Failed to list files', { error });
      return [];
    }
  }

  private async createBackup<T>(filename: string, data: T): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `${filename}_${timestamp}.json`;
      const backupPath = path.join(this.backupPath, backupFile);
      
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(backupPath, jsonData, 'utf-8');
      
      // Clean up old backups (keep last 10)
      await this.cleanupOldBackups(filename);
    } catch (error) {
      logger.error(`Failed to create backup for ${filename}`, { error });
    }
  }

  private async cleanupOldBackups(filename: string): Promise<void> {
    try {
      const files = await fs.readdir(this.backupPath);
      const backups = files
        .filter(file => file.startsWith(filename) && file.endsWith('.json'))
        .sort()
        .reverse();
      
      if (backups.length > 10) {
        const toDelete = backups.slice(10);
        for (const file of toDelete) {
          await fs.unlink(path.join(this.backupPath, file));
        }
      }
    } catch (error) {
      logger.error('Failed to cleanup old backups', { error });
    }
  }

  async startAutoBackup(): Promise<void> {
    if (this.config.autoBackup && this.config.backupInterval > 0) {
      this.backupTimer = setInterval(async () => {
        try {
          const files = await this.listFiles();
          for (const file of files) {
            const data = await this.read(file);
            if (data) {
              await this.createBackup(file, data);
            }
          }
        } catch (error) {
          logger.error('Auto backup failed', { error });
        }
      }, this.config.backupInterval);
    }
  }

  async stopAutoBackup(): Promise<void> {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = undefined;
    }
  }

  async getStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    lastBackup?: Date;
  }> {
    try {
      const files = await this.listFiles();
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(this.dataPath, `${file}.json`);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
      
      return {
        totalFiles: files.length,
        totalSize,
        lastBackup: undefined // Could be enhanced to track last backup time
      };
    } catch (error) {
      logger.error('Failed to get storage stats', { error });
      return { totalFiles: 0, totalSize: 0 };
    }
  }
}

// Default configuration
export const defaultStorageConfig: JsonStorageConfig = {
  dataDir: './data',
  backupDir: './backups',
  autoBackup: true,
  backupInterval: 5 * 60 * 1000, // 5 minutes
};

// Create default storage instance
export const jsonStorage = new JsonStorage(defaultStorageConfig); 