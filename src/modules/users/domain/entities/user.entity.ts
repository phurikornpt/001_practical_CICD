import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

export class LoadUserInput {
  id: string;
  name: string;
  email: string;
}

export class User {
  public id!: string;
  public name!: string;
  public email!: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static create(props: CreateUserInput): User {
    return new User(uuidv4(), props.name, props.email);
  }
  static load(props: LoadUserInput): User {
    return new User(props.id, props.name, props.email);
  }
}
