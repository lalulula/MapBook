const MapPostReply = require("../models/MapReply");


// Get all map post reply 
// return reply ids of post
const getAllMapPostReplies = async (req, res) => {
  try {
    const { sCommentId } = req.params;
    const mapPostReplies = await MapPostReply.find({map_comment_id: sCommentId});

    res.status(200).json(mapPostReplies);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAllExistingMapPostReplies = async (req, res) => {
  try {
    const mapPostReply = await MapPostReply.find();
    res.status(200).json(mapPostReply);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// Get map post reply with sPostReplyId
const getMapPostReply = async (req, res) => {
  // console.log(req);
  try {
    const { sReplyId } = req.params;
    const mapPostReply = await MapPostReply.findById(sReplyId);
    res.status(200).json(mapPostReply);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create map post reply
const createMapPostReply = async (req, res) => {
  try {
    const { map_reply_content, map_reply_owner, map_comment_id } =
      req.body;

    const newPostReply = new MapPostReply({
      map_reply_content,
      map_reply_owner,
      map_comment_id,
    });
    const savedPostReply = await newPostReply.save();
    console.log("map post reply created successfully");


    return res.status(201).json(savedPostReply);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update comment by map comment id
const editMapPostReply = async (req, res) => {
  try {
    const { sReplyId } = req.params;
    const { map_reply_content } = req.body;
    console.log(sReplyId);

    const updatedPostReply = await MapPostReply.findByIdAndUpdate(
      sReplyId,
      {
        map_reply_content: map_reply_content,
      },
      { new: true }
    );
    res.status(200).json(updatedPostReply);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Update Comment by map reply id
const deleteMapPostReply = async (req, res) => {
  console.log(req.params);
  try {
    const { sReplyId } = req.params;

    // remove mapComment id from mapPost
    const mapPostReply = await MapPostReply.findById(sReplyId);

    await MapPostReply.findByIdAndDelete(mapPostReply);
    // return res.status(200).json(mapPost);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};


module.exports = {
  getAllMapPostReplies: getAllMapPostReplies,
  getAllExistingMapPostReplies: getAllExistingMapPostReplies,
  getMapPostReply: getMapPostReply,
  createMapPostReply: createMapPostReply,
  editMapPostReply: editMapPostReply,
  deleteMapPostReply: deleteMapPostReply
};
