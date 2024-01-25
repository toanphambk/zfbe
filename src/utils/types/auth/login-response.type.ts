import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../users/entities/user.entity';

export class LoginResponseType {
  @ApiProperty()
  token: string;
  @ApiProperty()
  user: User;
}
