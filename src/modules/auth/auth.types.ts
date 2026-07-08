export interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
