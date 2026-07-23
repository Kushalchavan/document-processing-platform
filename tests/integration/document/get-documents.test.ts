import path from 'node:path';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../../src/app.js';

describe('GET /api/v1/documents', () => {
  it('should return all documents for the authenticated user', async () => {
    const timestamp = Date.now();
    const username = `user-${timestamp}`;
    const email = `user-${timestamp}@example.com`;
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

    const accessToken = loginResponse.body.accessToken;

    // Upload document
    const pdfPath = path.join(process.cwd(), 'tests/fixtures/sample.pdf');

    await request(app)
      .post('/api/v1/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('document', pdfPath);

    // Get documents
    const response = await request(app)
      .get('/api/v1/documents')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(Array.isArray(response.body.documents)).toBe(true);
    expect(response.body.documents).toHaveLength(1);

    expect(response.body.documents[0]).toHaveProperty('id');
    expect(response.body.documents[0]).toHaveProperty('file_name');
    expect(response.body.documents[0]).toHaveProperty('status');

    expect(response.body.pagination.total).toBe(1);
    expect(response.body.pagination.page).toBe(1);
  });
});
