import { ConflictError } from '@shared/errors/ConflictError';
import { createUser, findByEmail } from './auth.repository';
import { RegisterInput } from './auth.schema';
import bcrypt from 'bcrypt';

export async function register({ username, email, password }: RegisterInput) {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await createUser({ username, email, passwordHash });
  return newUser;
}
