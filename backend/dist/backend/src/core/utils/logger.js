"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
const app_config_1 = require("../config/app.config");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    logLevel;
    constructor() {
        this.logLevel = this.getLogLevelFromEnv();
    }
    getLogLevelFromEnv() {
        const level = process.env.LOG_LEVEL?.toLowerCase();
        switch (level) {
            case 'error': return LogLevel.ERROR;
            case 'warn': return LogLevel.WARN;
            case 'info': return LogLevel.INFO;
            case 'debug': return LogLevel.DEBUG;
            default: return app_config_1.config.server.environment === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
        }
    }
    formatMessage(level, message, data) {
        const timestamp = new Date().toISOString();
        const tenant = process.env.TENANT_ID || 'system';
        const baseMessage = `[${timestamp}] [${level}] [${tenant}] ${message}`;
        if (data) {
            return `${baseMessage} ${JSON.stringify(data)}`;
        }
        return baseMessage;
    }
    log(level, levelName, message, data) {
        if (this.logLevel >= level) {
            const formattedMessage = this.formatMessage(levelName, message, data);
            console.log(formattedMessage);
        }
    }
    error(message, data) {
        this.log(LogLevel.ERROR, 'ERROR', message, data);
    }
    warn(message, data) {
        this.log(LogLevel.WARN, 'WARN', message, data);
    }
    info(message, data) {
        this.log(LogLevel.INFO, 'INFO', message, data);
    }
    debug(message, data) {
        this.log(LogLevel.DEBUG, 'DEBUG', message, data);
    }
    // Module-specific logging
    module(moduleName) {
        return {
            error: (message, data) => this.error(`[${moduleName}] ${message}`, data),
            warn: (message, data) => this.warn(`[${moduleName}] ${message}`, data),
            info: (message, data) => this.info(`[${moduleName}] ${message}`, data),
            debug: (message, data) => this.debug(`[${moduleName}] ${message}`, data)
        };
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map