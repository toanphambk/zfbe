import { PartialType } from '@nestjs/swagger';
import { CreateMachineEventDto } from './create-machine-event.dto';

export class UpdateMachineEventDto extends PartialType(CreateMachineEventDto) {}
