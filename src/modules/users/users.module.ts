import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/createUser.usecase';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { InMemoryUserRepository } from './infrastructure/persistence/in-memory/in-memory-user.repository';
import { UserController } from './interface/controllers/user.controller';
import { GetAllUserUseCase } from './application/use-cases/getUser.usecase';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUserUseCase,
    {
      provide: IUserRepository,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [CreateUserUseCase, GetAllUserUseCase],
})
export class UsersModule {}
