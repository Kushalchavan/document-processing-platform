import { dbPool } from '@infrastructure/database/pool';
import { CreateUserInput } from './auth.types';

export async function findByEmail(email: string) {
  const result = await dbPool.query(
    `
  SELECT
    id,
    username,
    email,
    password_hash,
    created_at
  FROM users
  WHERE email = $1
  `,
    [email],
  );
  return result.rows[0] || null;
}

export async function createUser({ username, email, passwordHash }: CreateUserInput) {
  const result = await dbPool.query(
    `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
        `,
    [username, email, passwordHash],
  );
  return result.rows[0];
}
