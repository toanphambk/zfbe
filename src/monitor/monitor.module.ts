import { Module } from '@nestjs/common';

import { MonitorController } from './monitor.controller';
import { MonitorServiceFactory } from './monitor-service-factory.provider';

@Module({
  imports: [],
  controllers: [MonitorController],
  providers: [MonitorServiceFactory],
})
export class MonitorModule {}
