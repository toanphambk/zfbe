import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Machine } from './entities/machine.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Machine')
@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The machine has been successfully created.',
    type: Machine,
  })
  @Post()
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateMachineDto): Promise<Machine> {
    return this.machineService.create(createDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array of machines retrieved successfully.',
    type: [Machine],
  })
  @Get()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Machine[]> {
    return this.machineService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Single machine retrieved successfully.',
    type: Machine,
  })
  @Get(':id')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Machine>> {
    return this.machineService.findOne({ id: +id });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The machine has been successfully updated.',
    type: Machine,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.admin)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMachineDto,
  ): Promise<Machine> {
    return this.machineService.update(+id, updateDto);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The machine has been successfully removed.',
  })
  @Delete(':id')
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.machineService.remove({ id: +id });
  }
}
