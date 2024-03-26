import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { HardwareActionService } from './hardware-action.service';
import { Qrcode } from './entities/qrCode.entity';
import { CreateRFIDDto } from './dto/create-rfid.dto';
import { Rfid } from './entities/rfid.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('QR Code')
@Controller('qrCode')
export class HardwareActionController {
  constructor(private readonly qrCodeService: HardwareActionService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The QR code has been created.',
    type: Qrcode,
  })
  @Post('/createQrCode')
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  createQrCode(@Body() createDto: CreateQrCodeDto): Promise<Qrcode> {
    return this.qrCodeService.createQrCode(createDto);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The RFID entry has been created.',
    type: Rfid,
  })
  @Post('/createRFID')
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  createRFID(@Body() createDto: CreateRFIDDto): Promise<Rfid> {
    return this.qrCodeService.createRFID(createDto);
  }
}
