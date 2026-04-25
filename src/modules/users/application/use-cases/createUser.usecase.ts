import { Inject, Injectable } from '@nestjs/common';
import { User, CreateUserInput } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserDTO } from '../dto/user-dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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

    const user = User.create(command);

    await this.userRepository.save(user);

    return UserDTO.load(user);
  }
}
