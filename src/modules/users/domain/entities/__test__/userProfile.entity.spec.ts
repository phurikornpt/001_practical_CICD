import { validate } from 'class-validator';
import {
  UserProfile,
  CreateUserProfileInput,
  LoadUserInput,
} from '../user.profile.entity';

describe('UserProfile Entity', () => {
  describe('CreateUserProfileInput Validation', () => {
    it('should validate a correct CreateUserProfileInput', async () => {
      const input = new CreateUserProfileInput();
      input.bio = 'Hello, I am a student';
      input.avatar = 'https://example.com/avatar.jpg';

      input.location = 'New York';
      const errors = await validate(input);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if bio is empty', async () => {
      const input = new CreateUserProfileInput();
      input.bio = '';
      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('bio');
    });
  });

  describe('UserProfile.create', () => {
    it('should create a new UserProfile instance with a generated ID', () => {
      const input = new CreateUserProfileInput();
      input.bio = 'Hello, I am a student';
      input.avatar = 'https://example.com/avatar.jpg';
      input.location = 'New York';

      const userProfile = UserProfile.create(input);

      expect(userProfile).toBeInstanceOf(UserProfile);
      expect(userProfile.bio).toBe('Hello, I am a student');
      expect(userProfile.location).toBe('New York');
    });
  });
});
