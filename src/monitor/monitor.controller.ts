import { Controller } from '@nestjs/common';

import { MonitorServiceFactory } from './monitor-service-factory.provider';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorServiceFactory: MonitorServiceFactory) {}

  // @Post()
  // create(@Body() createMonitorDto: CreateMonitorDto) {
  //   return this.monitorService.create(createMonitorDto);
  // }

  // @Get()
  // getAllMonitorServices() {
  //   return this.monitorServiceFactory.getAllMonitorServices();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.monitorServiceFactory.getMonitorService(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMonitorDto: UpdateMonitorDto) {
  //   return this.monitorService.update(+id, updateMonitorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.monitorService.remove(+id);
  // }
}
