import { Module } from '@nestjs/common';
import { PlcCommunicationService } from './plc-communication.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  providers: [
    EventEmitter2, // Provide EventEmitter2 as a singleton
    {
      provide: 'PlcCommunicationServiceFactory',
      useFactory: (eventEmitter: EventEmitter2) => {
        // Return a function that always uses the same EventEmitter2 instance
        return () => new PlcCommunicationService<any>(eventEmitter);
      },
      inject: [EventEmitter2], // Inject the singleton instance of EventEmitter2
    },
  ],
  exports: ['PlcCommunicationServiceFactory', EventEmitter2],
})
export class PlcCommunicationModule {}
