import { CreateUserInput, LoadUserInput, User } from '../user.entity';
import { validate } from 'class-validator';

describe('User Entity', () => {
  describe('CreateUserInput Validation', () => {
    it('should validate a correct CreateUserInput', async () => {
      const input = new CreateUserInput();
      input.name = 'John Doe';
      input.email = 'john.doe@example.com';
      const errors = await validate(input);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if name is empty', async () => {
      const input = new CreateUserInput();
      input.name = '';
      input.email = 'john.doe@example.com';
      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation if email is empty', async () => {
      const input = new CreateUserInput();
      input.name = 'John Doe';
      input.email = '';
      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation if email is invalid', async () => {
      const input = new CreateUserInput();
      input.name = 'John Doe';
      input.email = 'invalid-email';
      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('User.create', () => {
    it('should create a new User instance with a generated ID', () => {
      const input = new CreateUserInput();
      input.name = 'Jane Doe';
      input.email = 'jane.doe@example.com';

      const user = User.create(input);

      expect(user).toBeInstanceOf(User);
      expect(typeof user.id).toBe('string');
      expect(user.id.length).toBeGreaterThan(0); // UUIDs are typically long strings
      expect(user.name).toBe('Jane Doe');
      expect(user.email).toBe('jane.doe@example.com');
    });
  });

  describe('User.load', () => {
    it('should load a User instance from existing data', () => {
      const existingData: LoadUserInput = {
        id: 'some-pre-existing-id',
        name: 'Existing User',
        email: 'existing.user@example.com',
      };

      const user = User.load(existingData);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('some-pre-existing-id');
      expect(user.name).toBe('Existing User');
      expect(user.email).toBe('existing.user@example.com');
    });
  });
});
