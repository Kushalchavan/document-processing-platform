import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { JwtPayload } from '../../modules/auth/auth.types.js';

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: '15m',
  });
}

export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: '7d',
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
}
