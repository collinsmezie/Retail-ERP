export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = this.getLogLevelFromEnv();
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toLowerCase();
    switch (level) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      default: return process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
    }
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const tenant = process.env.TENANT_ID || 'system';
    const baseMessage = `[${timestamp}] [${level}] [${tenant}] ${message}`;
    
    if (data) {
      return `${baseMessage} ${JSON.stringify(data)}`;
    }
    return baseMessage;
  }

  private log(level: LogLevel, levelName: string, message: string, data?: any): void {
    if (this.logLevel >= level) {
      const formattedMessage = this.formatMessage(levelName, message, data);
      console.log(formattedMessage);
    }
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, 'ERROR', message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, 'WARN', message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, 'INFO', message, data);
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  // Module-specific logging
  module(moduleName: string) {
    return {
      error: (message: string, data?: any) => this.error(`[${moduleName}] ${message}`, data),
      warn: (message: string, data?: any) => this.warn(`[${moduleName}] ${message}`, data),
      info: (message: string, data?: any) => this.info(`[${moduleName}] ${message}`, data),
      debug: (message: string, data?: any) => this.debug(`[${moduleName}] ${message}`, data)
    };
  }
}

export const logger = new Logger(); 