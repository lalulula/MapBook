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

  // create a test map to test all API for mapComment and MapReply
  let createdMapId;
  describe('POST /api/map/createMap', () => {
    test("should create new map", async () => {
      const response = await request(app)
      .post("/api/map/createMap")
      .send({
        "map_name": "This is test map",
        "topic": "test Topic",
        "is_visible": true,
        "user_id": "655fd58b2b0e9ff49fe19154",
        "map_description": "This is test map description",
        "mapPreviewImg": "test.mapPreviewImgUrl",
        "file_path": "test.fileUrl",
      })
      expect(response.statusCode).toBe(201);
      createdMapId = response.body._id;
    });
  });

  // MapComment
  // Test for getAllMapComments
  describe('GET /api/mapComment/mapComments/:sPostId', () => {
    test('should return all map comments of a target map post', async () => {
      const response = await request(app)
        .get(`/api/mapComment/mapComments/${createdMapId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  // Test for getAllExistingMapComments
  describe('GET /api/mapComment/existingMapComments', () => {
    test('should return all existing map comments', async () => {
      const response = await request(app)
        .get('/api/mapComment/existingMapComments');

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  // Test for createMapComment
  let createdMapCommentId;
  describe('POST /api/mapComment/createMapComment', () => {
    test('should create a new map comment', async () => {
      const response = await request(app)
        .post('/api/mapComment/createMapComment')
        .send({
          map_comment_content: 'New Map Comment',
          map_comment_owner: loggedInUserId,
          map_id: createdMapId,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('map_comment_content', 'New Map Comment');
      createdMapCommentId = response.body._id;
    });
  });

  // Test for getMapComment
  describe('GET /api/mapComment/:sCommentId', () => {
    test('should return map comment by ID', async () => {
      const response = await request(app)
        .get(`/api/mapComment/${createdMapCommentId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id', createdMapCommentId.toString());
    });
  });

  // Test for editMapComment
  describe('PUT /api/mapComment/editMapComment/:sCommentId', () => {
    test('should edit map comment content by Id', async () => {
      const response = await request(app)
        .put(`/api/mapComment/editMapComment/${createdMapCommentId}`)
        .send({ map_comment_content: 'Updated Comment' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('map_comment_content', 'Updated Comment');
    });
  });

  // mapReply
  // Test for getAllMapPostReplies
  describe('GET /api/mapReply/mapReplies/:sCommentId', () => {
    test('should return all replies of a target map comment', async () => {
      const response = await request(app)
        .get(`/api/mapReply/mapReplies/${createdMapCommentId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  // Test for getAllExistingMapPostReplies
  describe('GET /api/mapReply/existingMapReplies', () => {
    test('should return all existing map post replies', async () => {
      const response = await request(app)
        .get('/api/mapReply/existingMapReplies');

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  // Test for createMapPostReply
  let createdMapReplyId;
  describe('POST /api/mapReply/createMapReply', () => {
    test('should create a new map post reply', async () => {
      const response = await request(app)
        .post('/api/mapReply/createMapReply')
        .send({
          map_reply_content: 'New Reply',
          map_reply_owner: loggedInUserId,
          map_comment_id: createdMapCommentId,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('map_reply_content', 'New Reply');
      createdMapReplyId = response.body._id;
    });
  });

  // Test for getMapPostReply
  describe('GET /api/mapReply/:sReplyId', () => {
    test('should return map post reply by ID', async () => {
      const response = await request(app)
        .get(`/api/mapReply/${createdMapReplyId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id', createdMapReplyId.toString());
    });
  });

  // Test for editMapPostReply
  describe('PUT /api/mapReply/editMapReply/:sReplyId', () => {
    test('should edit map post reply content', async () => {
      const response = await request(app)
        .put(`/api/mapReply/editMapReply/${createdMapReplyId}`)
        .send({ map_reply_content: 'Updated Reply' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('map_reply_content', 'Updated Reply');
    });
  });

  // Test for deleteMapPostReply
  describe('DELETE /api/mapReply/deleteMapReply/:sReplyId', () => {
    test('should delete a map post reply by Id', async () => {
      const response = await request(app)
        .delete(`/api/mapReply/deleteMapReply/${createdMapReplyId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  // Test for deleteMapComment
  describe('DELETE /api/mapComment/deleteMapComment/:sCommentId', () => {
    test('should delete a map comment', async () => {
      const response = await request(app)
        .delete(`/api/mapComment/deleteMapComment/${createdMapCommentId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  // delete the create map from the database after testing every API
  describe('DELETE /api/maps/:id', () => {
    test("should delete map with a map id", async () => {
      const response = await request(app)
      .delete(`/api/maps/removeMap/${createdMapId}` )

    expect(response.statusCode).toBe(200);
    });
  });

  // Test for removeUser
  describe('DELETE /api/users/:id', () => {
    test('should delete the user', async () => {
      const response = await request(app)
        .delete(`/api/users/${loggedInUserId}`)
        .set('Authorization', `Bearer ${loggedInAuthToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('User and associated items deleted successfully');
    });

    test('should return 404 for non-existing user', async () => {
      const response = await request(app)
        .delete('/api/users/nonExistingUserId')
        .set('Authorization', `Bearer ${loggedInAuthToken}`);

      expect(response.statusCode).toBe(404);
    });
  });
});
// FIXED