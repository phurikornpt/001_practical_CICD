import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserProfileInput {
  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}

export class LoadUserInput {
  bio!: string;
  avatar!: string;
  location!: string;
}

// Value Object for User Profile
export class UserProfile {
  public bio!: string;
  public avatar!: string;
  public location!: string;

  constructor(props: CreateUserProfileInput) {
    this.bio = props.bio;
    this.avatar = props.avatar;
    this.location = props.location;
  }

  static create(props: CreateUserProfileInput): UserProfile {
    return new UserProfile(props);
  }
  static load(props: LoadUserInput): UserProfile {
    return new UserProfile(props);
  }
}
