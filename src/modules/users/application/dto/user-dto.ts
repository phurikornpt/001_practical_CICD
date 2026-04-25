import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../domain/entities/user.entity';

export class UserDTO {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  static load(user: User): UserDTO {
    const response = new UserDTO();
    response.id = user.id;
    response.name = user.name;
    response.email = user.email;
    return response;
  }
}
