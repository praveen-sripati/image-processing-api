import { app } from '../../index';
import supertest from 'supertest';

const request = supertest(app);

describe('/api endpoint response', () => {
  it('gets the api endpoint', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
  });
});
