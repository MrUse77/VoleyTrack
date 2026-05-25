type DatabaseInfo = {
    name: string;
};
export declare class AppService {
    private readonly pool;
    listDatabases(): Promise<{
        databases: DatabaseInfo[];
        error?: string;
    }>;
    getLandingPage(): Promise<string>;
}
export {};
