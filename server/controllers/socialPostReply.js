const SocialPostReply = require("../models/SocialPostReply");


// Get all social post reply 
// return comment ids of post
const getAllSocialPostReplys = async (req, res) => {
  try {
    const { sCommentId } = req.params;
    const socialPostReplys = await SocialPostReply.find({social_comment_id: sCommentId});

    res.status(200).json(socialPostReplys);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAllExistingSocialPostReplys = async (req, res) => {
  try {
    const socialPostReply = await SocialPostReply.find();
    res.status(200).json(socialPostReply);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// Get social post reply with sPostReplyId
const getSocialPostReply = async (req, res) => {
  // console.log(req);
  try {
    const { sPostReplyId } = req.params;
    const socialPostReply = await SocialPostReply.findById(sPostReplyId);
    res.status(200).json(socialPostReply);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create social post reply
const createSocialPostReply = async (req, res) => {
  try {
    const { social_reply_content, social_reply_owner, social_comment_id } =
      req.body;

    const newPostReply = new SocialPostReply({
      social_reply_content,
      social_reply_owner,
      social_comment_id,
    });
    const savedPostReply = await newPostReply.save();
    console.log("social post reply created successfully");


    return res.status(201).json(savedPostReply);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update comment by social comment id
const editSocialPostReply = async (req, res) => {
  try {
    const { sPostReplyId } = req.params;
    const { social_reply_content } = req.body;

    const updatedPostReply = await SocialPostReply.findByIdAndUpdate(
      sPostReplyId,
      {
        social_reply_content: social_reply_content,
      },
      { new: true }
    );
    res.status(200).json(updatedPostReply);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Update Comment by social reply id
const deleteSocialPostReply = async (req, res) => {
  console.log(req.params);
  try {
    const { sPostReplyId } = req.params;

    // remove socialComment id from socialPost
    const socialPostReply = await SocialPostReply.findById(sPostReplyId);

    await SocialPostReply.findByIdAndDelete(socialPostReply);
    // return res.status(200).json(socialPost);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};


module.exports = {
  getAllSocialPostReplys: getAllSocialPostReplys,
  getAllExistingSocialPostReplys: getAllExistingSocialPostReplys,
  getSocialPostReply: getSocialPostReply,
  createSocialPostReply: createSocialPostReply,
  editSocialPostReply: editSocialPostReply,
  deleteSocialPostReply: deleteSocialPostReply
};
