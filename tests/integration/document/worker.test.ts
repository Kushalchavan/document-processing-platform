import path from 'node:path';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../../src/app.js';
import { processDocument } from '../../../src/infrastructure/workers/document.worker.js';
import { findDocumentById } from '../../../src/modules/documents/document.repository.js';

describe('Document Worker', () => {
  it('should process an uploaded document', async () => {
    const timestamp = Date.now();
    const username = `kushal-${timestamp}`;
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
    const userId = loginResponse.body.user.id;
    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'sample.pdf');
    const uploadResponse = await request(app)
      .post('/api/v1/documents/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('document', pdfPath);

    const documentId = uploadResponse.body.id;

    await processDocument(documentId);

    const document = await findDocumentById(documentId, userId);

    expect(document).not.toBeNull();
    expect(document!.status).toBe('completed');
    expect(document!.extracted_text).toBeTruthy();
  });
});
