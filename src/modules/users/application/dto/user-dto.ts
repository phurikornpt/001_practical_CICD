import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../domain/entities/user.entity';

export class UserProfileDTO {
  @ApiProperty({ description: 'Bio of the user' })
  bio: string;
  @ApiProperty({ description: 'Avatar of the user' })
  avatar: string;
  @ApiProperty({ description: 'Location of the user' })
  location: string;
}

export class UserDTO {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'User profile' })
  userProfile?: UserProfileDTO;

  static load(user: User): UserDTO {
    const response = new UserDTO();
    response.id = user.id;
    response.name = user.name;
    response.email = user.email;

    response.userProfile = user.userProfile;
    return response;
  }
}
