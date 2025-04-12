export class EmailAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'EmailAlreadyExistsException';
  }
}
