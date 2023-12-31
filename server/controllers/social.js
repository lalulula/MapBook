const SocialPost = require("../models/SocialPost");
const cloudinary = require("cloudinary").v2;

// Get all social post
const getAllPost = async (req, res) => {
  try {
    const socialPost = await SocialPost.find();
    res.status(200).json(socialPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Get social post with PostId
const getPostDetails = async (req, res) => {
  // console.log(req);
  try {
    const { sPostId } = req.params;
    const socialPost = await SocialPost.findById(sPostId);
    res.status(200).json(socialPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
// Get all social post with specific userId
const getMySocialPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const socialPosts = await SocialPost.find({ post_owner: userId });
    res.status(200).json(socialPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    console.log("create Post")


    const { title, post_content, post_images, topic, customTopic, post_owner } =
      req.body;
    if (req.files == null || req.files.length == 0) {
      // if not, continue
      const newPost = new SocialPost({
        title,
        post_content,
        topic,
        customTopic,
        post_owner,
      });

      console.log(newPost);

      const savedPost = await newPost.save();
      console.log("post created successfully");
      return res.status(201).json(savedPost);
    } else {
      // console.log(req.file)
      const imagesUrl = [];

      for (var i = 0; i < req.files.length; i++) {
        var temp = await cloudinary.uploader.upload(req.files[i].path, async function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "Error",
            });
          }
        });

        console.log(temp["secure_url"])
        imagesUrl.push(temp["secure_url"]);
      }

      // if not, continue
      const newPost = new SocialPost({
        title,
        post_content,
        post_images: imagesUrl,
        topic,
        customTopic,
        post_owner,
      });

      console.log(newPost);
      const savedPost = await newPost.save();
      console.log("post created successfully");
      return res.status(201).json(savedPost);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update Post by post id
const editPost = async (req, res) => {
  console.log("req.files: ", req.files);
  try {
    const { sPostId } = req.params;
    const { title, post_content, post_images, topic, customTopic, view_count } =
      req.body;
    if (req.files == null || req.files.length == 0) {
      const updatedPost = await SocialPost.findByIdAndUpdate(
        sPostId,
        {
          title: title,
          post_content: post_content,
          post_images: post_images,
          topic: topic,
          post_images: [],
          customTopic: customTopic,
          view_count: view_count,
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    }
    else {
      // console.log(req.file)
      const imagesUrl = [];

      for (var i = 0; i < req.files.length; i++) {
        var temp = await cloudinary.uploader.upload(req.files[i].path, async function (err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "Error",
            });
          }
        });

        console.log(temp["secure_url"])
        imagesUrl.push(temp["secure_url"]);
      }


      const updatedPost = await SocialPost.findByIdAndUpdate(
        sPostId,
        {
          title: title,
          post_content: post_content,
          post_images: imagesUrl,
          topic: topic,
          customTopic: customTopic,
          view_count: view_count,
        },
        { new: true }
      );


      res.status(200).json(updatedPost);


    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  console.log(req.params);
  try {
    const { sPostId } = req.params;
    await SocialPost.findByIdAndDelete(sPostId);
    // return res.status(200).json(socialPost);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

// Update Post by post id
const likePost = async (req, res) => {
  try {
    const { sPostId } = req.params;
    const { userId } = req.body;
    const socialPost = await SocialPost.findById(sPostId);
    const likedUsers = socialPost["social_users_liked"];

    const index = likedUsers.indexOf(userId);
    if (index == -1) {
      likedUsers.push(userId);
    } else {
      likedUsers.splice(index, 1);
    }
    const updatedPost = await SocialPost.findByIdAndUpdate(
      sPostId,
      {
        social_users_liked: likedUsers,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Update Post by post id
const addViewCount = async (req, res) => {
  try {
    const { sPostId } = req.params;
    const socialPost = await SocialPost.findById(sPostId);
    var cur_view_count = socialPost.view_count;

    const updatedPost = await SocialPost.findByIdAndUpdate(
      sPostId,
      {
        view_count: cur_view_count + 1,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports = {
  getAllPost: getAllPost,
  getPostDetails: getPostDetails,
  createPost: createPost,
  editPost: editPost,
  deletePost: deletePost,
  getMySocialPosts: getMySocialPosts,
  likePost: likePost,
  addViewCount: addViewCount,
};
