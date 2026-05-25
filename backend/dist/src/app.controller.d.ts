import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getLanding(): Promise<string>;
    getDatabases(): Promise<{
        databases: {
            name: string;
        }[];
        error?: string;
    }>;
}
