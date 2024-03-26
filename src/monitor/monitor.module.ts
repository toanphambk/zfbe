import { Module } from '@nestjs/common';

import { MonitorServiceManagerController } from './monitor-service-manager.controller';
import { MonitorServiceManager } from './monitor-service-manager.service';
import { MachineModule } from 'src/machine/machine.module';
import { PlcCommunicationModule } from 'src/plc-communication/plc-communication.module';
import { MonitorService } from './monitor.service';
import { Machine } from 'src/machine/entities/machine.entity';
import { MonitorServiceFactory } from './interface/monitor.interface';
import { MesService } from 'src/mes/mes.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MesModule } from 'src/mes/mes.module';

@Module({
  imports: [MachineModule, PlcCommunicationModule, EventEmitter2, MesModule],
  controllers: [MonitorServiceManagerController],
  providers: [
    {
      provide: 'MonitorServiceFactory',
      useFactory: (
        PlcCommunicationServiceFactory,
        mesService: MesService,
      ): MonitorServiceFactory => {
        return (machine: Machine) =>
          new MonitorService(
            machine,
            PlcCommunicationServiceFactory,
            mesService,
          );
      },
      inject: ['PlcCommunicationServiceFactory', MesService],
    },
    MonitorServiceManager,
  ],
  exports: [MonitorServiceManager],
})
export class MonitorModule {}
