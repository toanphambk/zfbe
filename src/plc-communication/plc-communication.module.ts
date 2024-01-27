import { Module } from '@nestjs/common';
import { PlcCommunicationService } from './plc-communication.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  providers: [
    {
      provide: 'PlcCommunicationServiceFactory',
      useFactory: () => {
        return (eventEmitter: EventEmitter2) =>
          new PlcCommunicationService<any>(eventEmitter);
      },
      inject: [EventEmitter2],
    },
    EventEmitter2,
  ],
  exports: ['PlcCommunicationServiceFactory'],
})
export class PlcCommunicationModule {}
