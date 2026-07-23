import path from 'node:path';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../../src/app.js';

describe('POST /api/v1/documents/upload', () => {
  it('should upload a document successfully', async () => {
    const timestamp = Date.now();
    const email = `user-${timestamp}@example.com`;
    const username = `kushal-${timestamp}`;
    const password = 'password123';

    // Register
    await request(app).post('/api/v1/auth/register').send({
      username,
      email,
      password,
    });

    // Login
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email,
      password,
    });

    expect(loginResponse.status).toBe(200);

    const accessToken = loginResponse.body.accessToken;

    // Upload
    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'sample.pdf');

    const response = await request(app)
      .post('/api/v1/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('document', pdfPath);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('pending');
  });
});
