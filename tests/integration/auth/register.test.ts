import request from 'supertest';
import app from '../../../src/app.js';
import { describe, it, expect } from 'vitest';
import { dbPool } from '../../../src/infrastructure/database/pool.js';

describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const timestampNow = Date.now();
    const email = `user-${timestampNow}@example.com`; // for uniqe email
    const username = `kushal-${timestampNow}`; // for unique username

    const response = await request(app).post('/api/v1/auth/register').send({
      username,
      email,
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.username).toBe(username);
    expect(response.body.email).toBe(email);
    expect(response.body.created_at).toBeDefined();

    const result = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);

    expect(result.rowCount).toBe(1);

    const user = result.rows[0];

    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.password_hash).not.toBe('password123');
  });


it("should return 409 when email already exists", async () => {
  const timestamp = Date.now();

  const email = `user-${timestamp}@example.com`;
  const password = "password123";

  const username1 = `kushal-${timestamp}-1`;
  const username2 = `kushal-${timestamp}-2`;

  // First registration
  await request(app)
    .post("/api/v1/auth/register")
    .send({
      username: username1,
      email,
      password,
    });

  // Duplicate registration
  const response = await request(app)
    .post("/api/v1/auth/register")
    .send({
      username: username2,
      email, // same email
      password,
    });

  expect(response.status).toBe(409);
  expect(response.body.error.message).toBe(
    "User with this email already exists"
  );
});
});
