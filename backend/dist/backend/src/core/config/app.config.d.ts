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
export declare const config: AppConfig;
export default config;
//# sourceMappingURL=app.config.d.ts.map