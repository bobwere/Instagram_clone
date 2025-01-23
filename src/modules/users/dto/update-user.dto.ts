import { CreateUserDto } from './create-user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

// this update not to include updating email, emails will be updated on a separate route
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email' , 'password'])
) {}
