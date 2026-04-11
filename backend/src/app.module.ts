import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantelModule } from './plantel/plantel.module';
import { IamModule } from './iam/iam.module';
import { EncuentrosModule } from './encuentros/encuentros.module';
import { ProyeccionesModule } from './proyecciones/proyecciones.module';

@Module({
  imports: [PlantelModule, IamModule, EncuentrosModule, ProyeccionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
