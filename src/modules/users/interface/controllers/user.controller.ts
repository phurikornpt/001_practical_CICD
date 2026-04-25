import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CreateUserUseCase,
  CreateUserDTO,
} from '../../application/use-cases/createUser.usecase';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDTO } from '../../application/dto/user-dto';
import { GetAllUserUseCase } from '../../application/use-cases/getUser.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUserUseCase: GetAllUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDTO,
  })
  async create(@Body() createUserDto: CreateUserDTO) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserDTO],
  })
  async getAll() {
    return this.getAllUserUseCase.execute();
  }
}
