import path from 'node:path';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../../src/app.js';
import { documentQueue } from '../../../src/infrastructure/queue/document.queue.js';

describe('Document Queue', () => {
  it('should enqueue a document processing job after upload', async () => {
    await documentQueue.drain();
    const timestamp = Date.now();
    const username = `kushal-${timestamp}`;
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

    // Upload
    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'sample.pdf');

    const uploadResponse = await request(app)
      .post('/api/v1/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('document', pdfPath);

    expect(uploadResponse.status).toBe(201);

    // Verify job was queued
    const jobs = await documentQueue.getJobs(['waiting', 'active', 'completed']);

    expect(jobs).toHaveLength(1);
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs[0].data.documentId).toBe(uploadResponse.body.id);
  });
});
