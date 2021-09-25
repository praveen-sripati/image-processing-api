import { app, port } from '../index';
import supertest from 'supertest';

const request = supertest(app);

describe('Port Number Validation', () => {
  it('should be port 3000', () => {
    expect(port).toEqual(3000);
  });
});

describe('Main index.ts endpoint testing', () => {
  it('should redirect to /api', async () => {
    const response = await request.get('/');
    expect(response.statusCode).toEqual(302);
  });
});
