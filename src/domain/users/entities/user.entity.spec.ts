import { User, UserRole } from './user.entity';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: UserRole.USER,
    });
  });

  describe('constructor', () => {
    it('should create a user with provided properties', () => {
      expect(user.id).toBe('1');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashedPassword');
      expect(user.role).toBe(UserRole.USER);
    });

    it('should create a user with default role when not provided', () => {
      const defaultUser = new User({
        id: '2',
        name: 'Default User',
        email: 'default@example.com',
        password: 'hashedPassword',
      });

      expect(defaultUser.role).toBe(UserRole.USER);
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', () => {
      user.role = UserRole.ADMIN;
      expect(user.isAdmin()).toBe(true);
    });

    it('should return false when user is not admin', () => {
      user.role = UserRole.USER;
      expect(user.isAdmin()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the specified role', () => {
      user.role = UserRole.ADMIN;
      expect(user.hasRole(UserRole.ADMIN)).toBe(true);
    });

    it('should return false when user does not have the specified role', () => {
      user.role = UserRole.USER;
      expect(user.hasRole(UserRole.ADMIN)).toBe(false);
    });
  });
});
