import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { NullableType } from 'src/utils/types/nullable.type';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ShiftService } from './shift.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Shift')
@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Shift successfully created.',
    type: Shift,
  })
  create(@Body() createDto: CreateShiftDto): Promise<Shift> {
    return this.shiftService.create(createDto);
  }

  @Get()
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'id',
    description: 'Filter shifts by production line ID',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of shifts.',
    type: [Shift],
  })
  findAll(@Query('id') id?: number): Promise<Shift[]> {
    return this.shiftService.findAll(id);
  }

  @Get(':id')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shift found.',
    type: Shift,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<NullableType<Shift>> {
    return this.shiftService.findOne({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.admin)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shift successfully updated.',
    type: Shift,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateShiftDto,
  ): Promise<Shift> {
    return this.shiftService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Shift successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.shiftService.remove({ id });
  }
}
