import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../../src/app.js';

describe('POST /api/v1/auth/refresh', () => {
  it('should issue a new access token', async () => {
    const agent = request.agent(app);

    const timestamp = Date.now();

    const email = `user-${timestamp}@example.com`;
    const username = `kushal-${timestamp}`;
    const password = 'password123';

    // Register
    await agent.post('/api/v1/auth/register').send({
      username,
      email,
      password,
    });

    // Login (stores cookie automatically)
    await agent.post('/api/v1/auth/login').send({
      email,
      password,
    });

    // Refresh
    const response = await agent.post('/api/v1/auth/refresh');

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refreshToken=');
  });
});
