const request = require('supertest');
const app = require('../backend/app');

describe('API Destinations', () => {
  it('returns destinations list', async () => {
    const res = await request(app).get('/api/destinations');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
  });
});
