const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const DiscussionPost = require("../models/DiscussionPost");

// Get all discussion post
// TODO
const getAllPost = async (req, res) => {
    console.log(req)
    try {
      const { id } = req.params;
      const discussionPost = await DiscussionPost.findById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};

// Get discussion post id
// TODO
const getPost = async (req, res) => {
    console.log(req)
    try {
      const { id } = req.params;
      const discussionPost = await DiscussionPost.findById(id);
      res.status(200).json(discussionPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};

// Create Post
// TODO
const createPost = async (req, res) => {
    console.log(req)
    try {
      const { id } = req.params;
      const discussionPost = await DiscussionPost.findById(id);
      res.status(200).json(discussionPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};

// Update Post by post id
// TODO
const editPost = async (req, res) => {
    try {
        const { username, password, } = req.body;
    
        const updatedPost = await User.findOneAndUpdate(
          { username: username },
          { password: password },
        );
    
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(404).json({ message: err.message });
      }
};

// Delete Post by post id
// TODO
const deletePost = async (req, res) => {
    console.log(req)
    try {
      const { id } = req.params;
      const discussionPost = await DiscussionPost.findOneAndDelete(id);
      res.status(200).json(discussionPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
};


module.exports = { getAllPost: getAllPost, getPost: getPost, createPost: createPost, editPost: editPost, deletePost: deletePost };