const request = require("supertest");
const mongoose = require("mongoose");
const { SHA256, enc } = require("crypto-js");

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

  // Auth
  // Test for register
  let loggedInAuthToken;
  let loggedInUserId;
  describe('POST /api/auth/register', () => {
    test('should create a new user and return a created user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newUser', password: SHA256("Password123").toString(enc.Hex), email: 'newuser@example.com' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('username');
    });

    test('should return 400 for duplicate username', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newUser', password: 'Password123', email: 'newuser@example.com' });

      expect(response.statusCode).toBe(400);
    });
  });

  // Test for login
  describe('POST /api/auth/login', () => {
    test('should return 200 and a valid token for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'newUser', password: SHA256("Password123").toString(enc.Hex) });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      loggedInAuthToken = response.body.token;
      loggedInUserId = response.body.user._id;
    });

    test('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonExistingUser', password: 'nonExistingPassword' });

      expect(response.statusCode).toBe(404);
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

  // Users
  // Test for getCurrentUser
  describe('GET /api/users/:id', () => {
    test('should return the current logged in user', async () => {
      const response = await request(app)
        .get(`/api/users/${loggedInUserId}`)
        .set('Authorization', `Bearer ${loggedInAuthToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id', loggedInUserId.toString());
    });

    test('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .get('/api/users/nonExistingUserId')
        .set('Authorization', `Bearer ${loggedInAuthToken}`);

      expect(response.statusCode).toBe(404);
    });
  });

  // Test for getAllUsers
  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  // Test for getUserById
  describe('GET /api/users/getUser/:id', () => {
    test('should return user by ID', async () => {
      const response = await request(app)
        .get(`/api/users/getUser/${loggedInUserId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id', loggedInUserId.toString());
    });

    test('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .get('/api/users/getUser/nonExistingUserId');

      expect(response.statusCode).toBe(404);
    });
  });

  // Test for updateUser
  describe('PUT /api/users/:id', () => {
    test('should update user information', async () => {
      const response = await request(app)
        .put(`/api/users/${loggedInUserId}`)
        .set('Authorization', `Bearer ${loggedInAuthToken}`)
        .field('username', 'newUserUpdated')

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('username', "newUserUpdated");
    });
  });

  // Test for removeUser
  describe('DELETE /api/users/:id', () => {
    test('should delete the user', async () => {
      const response = await request(app)
        .delete(`/api/users/${loggedInUserId}`)
        .set('Authorization', `Bearer ${loggedInAuthToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('User deleted successfully');
    });

    test('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .delete('/api/users/nonExistingUserId')
        .set('Authorization', `Bearer ${loggedInAuthToken}`);

      expect(response.statusCode).toBe(404);
    });
  });

  // Test for adminRemoveUser
  // describe('DELETE /api/users/admin/:id', () => {
  //   test('should delete a user by an admin', async () => {
  //     const response = await request(app)
  //       .delete('/api/users/admin/656ea11c1c108ae5fe4986d3');

  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toHaveProperty('success', true);
  //   });

  //   test('should return 404 for non-existing user', async () => {
  //     const response = await request(app)
  //       .delete('/api/users/admin/nonExistingUserId');

  //     expect(response.statusCode).toBe(404);
  //   });
  // });

});