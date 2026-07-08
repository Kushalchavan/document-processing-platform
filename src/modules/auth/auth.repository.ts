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

export async function createRefreshToken(userId: number, tokenHash: string, expiresAt: Date) {
  await dbPool.query(
    `
      INSERT INTO refresh_tokens (
        user_id,
        token_hash,
        expires_at
      )
      VALUES ($1, $2, $3)
    `,
    [userId, tokenHash, expiresAt],
  );
}

export async function findRefreshTokenByUserId(userId: number) {
  const result = await dbPool.query(
    `
      SELECT *
      FROM refresh_tokens
      WHERE user_id = $1
      AND revoked_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [userId],
  );

  return result.rows[0] || null;
}

export async function updateRefreshToken(userId: number, tokenHash: string, expiresAt: Date) {
  await dbPool.query(
    `
      UPDATE refresh_tokens
      SET
        token_hash = $1,
        expires_at = $2,
        revoked_at = NULL
      WHERE user_id = $3
    `,
    [tokenHash, expiresAt, userId],
  );
}

export async function revokeRefreshToken(userId: number) {
  await dbPool.query(
    `
      UPDATE refresh_tokens
      SET revoked_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `,
    [userId],
  );
}
