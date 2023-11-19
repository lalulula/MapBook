const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const SocialPost = require("../models/SocialPost");

// Get all social post
const getAllPost = async (req, res) => {
  try {
    const socialPost = await SocialPost.find();
    res.status(200).json(socialPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Get social post with id
const getPost = async (req, res) => {
  // console.log(req);
  try {
    const { sPostId } = req.params;
    const socialPost = await SocialPost.findById(sPostId);
    res.status(200).json(socialPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, post_content, post_images, topic, customTopic, post_owner } =
      req.body;

    console.log("req.body: ", req.body); //why isn't this printing

    // if not, continue
    const newPost = new SocialPost({
      title,
      post_content,
      post_images,
      topic,
      customTopic,
      post_owner,
    });
    const savedPost = await newPost.save();
    console.log("post created successfully");
    return res.status(201).json(savedPost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update Post by post id
const editPost = async (req, res) => {
  try {
    const { sPostId } = req.params;

    const { title, post_content, post_images, topic, customTopic } = req.body;

    const updatedPost = await SocialPost.findByIdAndUpdate(
      sPostId,
      {
        title: title,
        post_content: post_content,
        post_images: post_images,
        topic: topic,
        customTopic: customTopic,
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Delete Post by post id
const deletePost = async (req, res) => {
  console.log(req.params);
  try {
    const { sPostId } = req.params;

    const socialPost = await SocialPost.findByIdAndDelete(sPostId);
    res.status(200).json(socialPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  getAllPost: getAllPost,
  getPost: getPost,
  createPost: createPost,
  editPost: editPost,
  deletePost: deletePost,
};
