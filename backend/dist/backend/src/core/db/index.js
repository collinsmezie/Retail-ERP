"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDb = connectDb;
exports.disconnectDb = disconnectDb;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
async function connectDb() {
    try {
        await exports.prisma.$connect();
        console.log('Prisma SQLite connection established');
    }
    catch (error) {
        console.error('Prisma connection failed:', error);
        throw error;
    }
}
async function disconnectDb() {
    await exports.prisma.$disconnect();
}
//# sourceMappingURL=index.js.map