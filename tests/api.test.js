const request = require('supertest');
const app = require('../backend/app');

let server;

beforeAll((done) => {
  // démarre le serveur sur un port temporaire avant les tests
  server = app.listen(3001, done);
});

afterAll((done) => {
  // ferme le serveur après les tests pour que Jest s'arrête correctement
  server.close(done);
});

describe('API Destinations', () => {
  it('returns destinations list', async () => {
    const res = await request(server).get('/api/destinations');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
  });
});
