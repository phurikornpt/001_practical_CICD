import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserDTO } from '../dto/user-dto';

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAll();
    if (!users) {
      throw new Error('No users found');
    }

    return users.map((u) => UserDTO.load(u));
  }
}
