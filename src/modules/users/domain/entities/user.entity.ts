import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from './user.profile.entity';

export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  userProfile?: UserProfile;
}

export class LoadUserInput {
  id: string;
  name: string;
  email: string;
  userProfile?: UserProfile;
}

export class User {
  public id!: string;
  public name!: string;
  public email!: string;
  public userProfile?: UserProfile;

  constructor(props: LoadUserInput) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.userProfile = props.userProfile;
  }
  static create(props: CreateUserInput): User {
    return new User({
      id: uuidv4(),
      name: props.name,
      email: props.email,
      userProfile: props.userProfile,
    });
  }
  static load(props: LoadUserInput): User {
    return new User(props);
  }
}
