import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { MesService } from './mes.service';
import { Record } from './entity/record.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { FindAllRecordByMachineAndDateTimeDto } from './dto/findAllRecordByMachineAndDateTime.dto';
import { GetDailyLineChartDataDto } from './dto/getDailyLineChartData.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Mes')
@Controller('mes')
export class MesController {
  constructor(private readonly mesService: MesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array of all finded Record.',
    type: [Record],
  })
  @Get()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  findAllRecord(): Promise<Record[]> {
    return this.mesService.getAllRecords();
  }

  @Get('machineDateTime')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'list of found record matched query.',
    type: [Record],
  })
  @HttpCode(HttpStatus.OK)
  findAllRecordByMachineAndDateTime(
    @Query() query: FindAllRecordByMachineAndDateTimeDto,
  ): Promise<Record[]> {
    return this.mesService.getAllRecordsByMachineAndTime(query);
  }

  @Get('dailyLineChartData')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Data for daily record line chart',
    type: [Number],
  })
  @HttpCode(HttpStatus.OK)
  getDailyLineChartData(
    @Query() query: GetDailyLineChartDataDto,
  ): Promise<{ Hour: number; Actual: number }[]> {
    return this.mesService.getDailyLineChartData(query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Single message retrieved successfully.',
    type: Record,
  })
  @Get(':moduleSerialNo')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  findOneRecord(
    @Param('moduleSerialNo') moduleSerialNo: string,
  ): Promise<NullableType<Record>> {
    return this.mesService.getOneRecord({ moduleSerialNo });
  }
}
