import { MachineEventsService } from './machine-events.service';
import { Module } from '@nestjs/common';
import { MonitorModule } from 'src/monitor/monitor.module';

@Module({
  imports: [MonitorModule],
  controllers: [],
  providers: [MachineEventsService],
})
export class MachineEventsModule {}
