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
import { Qrcode } from './entities/qrCode.entity';
import { QrCodeService } from './qrCode.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('QR Code')
@Controller('qrCode')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The QRcode scanned',
    type: Qrcode,
  })
  @Post()
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateQrCodeDto): Promise<Qrcode> {
    return this.qrCodeService.create(createDto);
  }
}
