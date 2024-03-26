import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { MonitorServiceManager } from './monitor-service-manager.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';

@Controller('monitor')
export class MonitorServiceManagerController {
  constructor(private readonly monitorServiceManager: MonitorServiceManager) {}
  @Get()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'machineId',
    description: 'Filter record by machine ID',
    type: Number,
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of shifts.',
  })
  getMachineState(@Query('machineId') machineId: number) {
    return this.monitorServiceManager.getMonitorServiceState(machineId);
  }
}
