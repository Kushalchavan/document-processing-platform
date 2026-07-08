import { ConflictError } from '@shared/errors/ConflictError';
import {
  createRefreshToken,
  createUser,
  findByEmail,
  revokeRefreshToken,
  findRefreshTokenByUserId,
  updateRefreshToken,
} from './auth.repository';
import { LoginInput, RegisterInput, RefreshInput } from './auth.schema';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '@shared/errors/UnauthorizedError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@shared/utils/jwt';

export async function register({ username, email, password }: RegisterInput) {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await createUser({ username, email, passwordHash });
  return newUser;
}

export async function login({ email, password }: LoginInput) {
  // find the user by email
  const user = await findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Compare passwords using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
  });

  // Hash the refresh token before storing it in the database
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  // store the hashed refresh token
  await createRefreshToken(
    user.id,
    refreshTokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
}

export async function logout(userId: number) {
  await revokeRefreshToken(userId);
}

export async function refresh({ refreshToken }: RefreshInput) {
  // Verify JWT
  const payload = verifyRefreshToken(refreshToken);

  //  Find stored refresh token
  const storedToken = await findRefreshTokenByUserId(payload.userId);

  if (!storedToken) {
    throw new UnauthorizedError('Refresh token not found');
  }

  //  Compare hash
  const isValid = await bcrypt.compare(refreshToken, storedToken.token_hash);

  if (!isValid) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  //  Generate new tokens
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  const newRefreshToken = generateRefreshToken({
    userId: payload.userId,
    email: payload.email,
  });

  // Hash new refresh token
  const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

  // Rotate refresh token
  await updateRefreshToken(
    payload.userId,
    refreshTokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
