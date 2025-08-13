"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
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
exports.default = exports.config;
//# sourceMappingURL=app.config.js.map