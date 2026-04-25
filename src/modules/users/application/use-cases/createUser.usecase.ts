import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserDTO } from '../dto/user-dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';
import {
  CreateUserProfileInput,
  UserProfile,
} from '../../domain/entities/user.profile.entity';

export class CreateUserDTO {
  @ApiProperty({ description: 'Username of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User profile' })
  @IsObject({ each: true })
  userProfile?: CreateUserProfileInput;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserDTO): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const userProfile = UserProfile.create({
      bio: command?.userProfile?.bio || '',
      avatar: command?.userProfile?.avatar || '',
      location: command?.userProfile?.location || '',
    });

    const user = User.create({ ...command, userProfile });

    await this.userRepository.save(user);

    return UserDTO.load(user);
  }
}
