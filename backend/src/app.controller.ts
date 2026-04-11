import { Controller, Get, Header } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header("Content-Type", "text/html; charset=utf-8")
  async getLanding(): Promise<string> {
    return this.appService.getLandingPage();
  }

  @Get("api/databases")
  async getDatabases() {
    return this.appService.listDatabases();
  }
}
