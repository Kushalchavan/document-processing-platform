import path from 'node:path';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../../src/app.js';

describe('GET /api/v1/documents/:id', () => {
  it('should return a document by id', async () => {
    const timestamp = Date.now();

    const username = `user-${timestamp}`;
    const email = `user-${timestamp}@example.com`;
    const password = 'password123';

    await request(app).post('/api/v1/auth/register').send({
      username,
      email,
      password,
    });

    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email,
      password,
    });

    const accessToken = loginResponse.body.accessToken;

    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'sample.pdf');

    const uploadResponse = await request(app)
      .post('/api/v1/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('document', pdfPath);

    const documentId = uploadResponse.body.id;

    const response = await request(app)
      .get(`/api/v1/documents/${documentId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.id).toBe(documentId);
    expect(response.body.file_name).toBe('sample.pdf');
    expect(response.body.status).toBe('pending');
  });

  it('should return 404 when document does not exist', async () => {
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

    const response = await request(app)
      .get('/api/v1/documents/999999')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });
});
