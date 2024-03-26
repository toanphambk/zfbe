import { Module } from '@nestjs/common';
import { PlcCommunicationService } from './plc-communication.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConfigurationType,
  PlcCommunicationServiceFactory,
} from './interface/plc-communication.interface';

@Module({
  providers: [
    {
      provide: 'PlcCommunicationServiceFactory',
      useFactory: (
        eventEmitter: EventEmitter2,
      ): PlcCommunicationServiceFactory<any> => {
        return (config: ConfigurationType<any>) =>
          new PlcCommunicationService<any>(eventEmitter, config);
      },
      inject: [EventEmitter2],
    },
  ],
  exports: ['PlcCommunicationServiceFactory'],
})
export class PlcCommunicationModule {}
