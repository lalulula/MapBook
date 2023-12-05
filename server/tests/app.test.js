const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../server");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("MapBook API tests:", () => {

  // Give time to any async operation to complete after each test
  afterEach(async () => {
    await sleep(2000);
  });

  // Also close any pending connection (or related) if any
  afterAll(() => { 
    mongoose.connection.close()
  })

  // Test for login
  let userToken;
  describe('POST /api/auth/login', () => {
    test('should return 200 and a valid token for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'sam', password: '008c70392e3abfbd0fa47bbc2ed96aa99bd49e159727fcba0f2e6abeb3a9d601' /* sent hashed pw */ });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      userToken = response.body.token;
    });

    test('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonExistingUser', password: 'nonExistingPassword' });

      expect(response.statusCode).toBe(404);
    });
  });

  // Test for register
  describe('POST /api/auth/register', () => {
    test('should create a new user and return a created user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newUser', password: 'newPassword', email: 'newuser@example.com' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('username');
    });

    test('should return 400 for duplicate username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newUser', password: 'newPassword', email: 'newuser@example.com' });

      expect(response.statusCode).toBe(400);
    });
  });

  // Test for resetPasswordRequest
  let resetToken;
  let resetUserId; // userId for user that request pw reset
  describe('POST /api/auth/resetPasswordRequest', () => {
    test('should send a reset token for an existing user', async () => {
      const response = await request(app)
        .post('/api/auth/resetPasswordRequest')
        .send({ email: 'rinrotanak0123@gmail.com' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('resetToken');
      expect(response.body).toHaveProperty('userId');
      resetToken = response.body.resetToken;
      resetUserId = response.body.userId;
    });

    test('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .post('/api/auth/resetPasswordRequest')
        .send({ email: 'nonExistingUser@example.com' });

      expect(response.statusCode).toBe(404);
    });

    // test('should return 405 for google sign-in user', async () => {
    //   const response = await request(app)
    //     .post('/api/auth/resetPasswordRequest')
    //     .send({ email: 'rinrotanak123@gmail.com' });

    //   expect(response.statusCode).toBe(405);
    // });
  });

  // Test for validateResetToken
  describe('POST /api/auth/validateResetToken', () => {
    test('should validate a valid reset token', async () => {
      const response = await request(app)
        .post('/api/auth/validateResetToken')
        .send({ resetToken: resetToken, userId: resetUserId });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  // Test for resetPassword
  describe('POST /api/auth/resetPassword', () => {
    test('should reset password for a valid token and user ID', async () => {
      const response = await request(app)
        .post('/api/auth/resetPassword')
        .send({ userId: resetUserId, resetToken: resetToken, resetPassword: 'Password123' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('should return 404 for invalid or expired reset token', async () => {
      const response = await request(app)
        .post('/api/auth/resetPassword')
        .send({ userId: resetUserId, resetToken: resetToken, resetPassword: 'newPassword' });

      expect(response.statusCode).toBe(404);
    });
  });
});