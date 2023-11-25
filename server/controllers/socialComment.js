const SocialPost = require("../models/SocialPost");
const SocialComment = require("../models/SocialPostComment");


// Get all social post comment
// return comment ids of post
const getAllSocialComments = async (req, res) => {
  try {
    const { sPostId } = req.params;
    const socialPost = await SocialPost.findById(sPostId);
    const socialPostComments = socialPost["social_comments"];
    console.log("socialpostcomments backend: ", socialPostComments);
    console.log("socialpost: ", socialPost);

    res.status(200).json(socialPostComments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAllExistingSocialComments = async (req, res) => {
  try {
    const socialComment = await SocialComment.find();
    res.status(200).json(socialComment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// Get social post comment with CommentId
const getSocialComment = async (req, res) => {
  // console.log(req);
  try {
    const { sCommentId } = req.params;
    const socialComment = await SocialComment.findById(sCommentId);
    res.status(200).json(socialComment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create social comment
const createSocialComment = async (req, res) => {
  try {
    const { social_comment_content, social_comment_owner, social_post_id } =
      req.body;

    console.log("req.body: ", req.body); //why isn't this printing

    // if not, continue
    const newComment = new SocialComment({
      social_comment_content,
      social_comment_owner,
      social_post_id,
    });
    const savedComment = await newComment.save();
    console.log("social comment created successfully");

    // add socialComment id to socialPost
    const socialPost = await SocialPost.findById(social_post_id);
    const commentList = socialPost["social_comments"]
    commentList.push(savedComment["_id"])
    await SocialPost.findByIdAndUpdate(
      social_post_id,
      {
        social_comments: commentList,
      },
      { new: true }
    );

    return res.status(201).json(savedComment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update comment by social comment id
const editSocialComment = async (req, res) => {
  try {
    const { sCommentId } = req.params;
    const { social_comment_content } = req.body;

    const updatedComment = await SocialComment.findByIdAndUpdate(
      sCommentId,
      {
        social_comment_content: social_comment_content,
      },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Update Comment by social comment id
const deleteSocialComment = async (req, res) => {
  console.log(req.params);
  try {
    const { sCommentId } = req.params;

    // remove socialComment id from socialPost
    const socialComment = await SocialComment.findById(sCommentId);
    const socialPost = await SocialPost.findById(socialComment["social_post_id"]);
    const commentList = socialPost["social_comments"]

    const index = commentList.indexOf(sCommentId);
    commentList.splice(index, 1);
    await SocialPost.findByIdAndUpdate(
      socialComment["social_post_id"],
      {
        social_comments: commentList,
      },
      { new: true }
    );


    await SocialComment.findByIdAndDelete(sCommentId);
    // return res.status(200).json(socialPost);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};


module.exports = {
  getAllSocialComments: getAllSocialComments,
  getSocialComment: getSocialComment,
  createSocialComment: createSocialComment,
  editSocialComment: editSocialComment,
  deleteSocialComment: deleteSocialComment,
  getAllExistingSocialComments: getAllExistingSocialComments
};
