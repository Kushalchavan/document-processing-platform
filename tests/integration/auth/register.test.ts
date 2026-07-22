import request from 'supertest';
import app from '../../../src/app.js';
import { describe, expect, it } from 'vitest';

describe('GET /health', () => {
  it('should return application health status', async () => {
    // Arrange
    // Nothing to prepare

    // Act
    const response = await request(app).get('/health');

    // Assert
    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: 'ok',
    });
  });
});