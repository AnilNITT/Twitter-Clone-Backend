const supertest = require('supertest');
const app = require('../src/index'); // Assuming this is your main application file

const request = supertest(app);

describe('Login User API', () => {
    
  test('POST /api/user/login - Should return a JWT token on successful login', async () => {
    
    const userData = { email: 'user1', password: 'password1' };

    const response = await request.post('/api/user/login').send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/user/login - Should return an error on invalid credentials', async () => {
    const userData = { email: 'nonexistentuser', password: 'wrongpassword' };

    const response = await request.post('/api/user/login').send(userData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});