const MapPost = require("../models/MapObj");
const MapComment = require("../models/MapComment");


// Get all map comments of a target map post
const getAllMapComments = async (req, res) => {
  try {
    const { sPostId } = req.params;
    // const mapPost = await MapPost.findById(sPostId);
    // const mapPostComments = mapPost["map_comments"];
    const mapComments = await MapComment.find({ "map_id": sPostId })

    res.status(200).json(mapComments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAllExistingMapComments = async (req, res) => {
  try {
    const mapComment = await MapComment.find();
    res.status(200).json(mapComment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// Get map post comment with CommentId
const getMapComment = async (req, res) => {
  // console.log(req);
  try {
    const { sCommentId } = req.params;
    const mapComment = await MapComment.findById(sCommentId);
    res.status(200).json(mapComment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Create map comment
const createMapComment = async (req, res) => {
  try {
    const { map_comment_content, map_comment_owner, map_id } =
      req.body;

    console.log("req.body: ", req.body); //why isn't this printing

    // if not, continue
    const newComment = new MapComment({
      map_comment_content,
      map_comment_owner,
      map_id,
    });
    const savedComment = await newComment.save();
    console.log("map comment created successfully");

    // add mapComment id to mapPost
    const mapPost = await MapPost.findById(map_id);
    const commentList = mapPost["map_comments"]
    commentList.push(savedComment["_id"])
    await MapPost.findByIdAndUpdate(
      map_id,
      {
        map_comments: commentList,
      },
      { new: true }
    );

    return res.status(201).json(savedComment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update comment by map comment id
const editMapComment = async (req, res) => {
  try {
    const { sCommentId } = req.params;
    const { map_comment_content } = req.body;

    const updatedComment = await MapComment.findByIdAndUpdate(
      sCommentId,
      {
        map_comment_content: map_comment_content,
      },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Delete Comment by map comment id
const deleteMapComment = async (req, res) => {
  console.log(req.params);
  try {
    const { sCommentId } = req.params;

    // remove mapComment id from mapPost
    const mapComment = await MapComment.findById(sCommentId);
    const mapPost = await MapPost.findById(mapComment["map_id"]);
    const commentList = mapPost["map_comments"]

    const index = commentList.indexOf(sCommentId);
    commentList.splice(index, 1);
    await MapPost.findByIdAndUpdate(
      mapComment["map_id"],
      {
        map_comments: commentList,
      },
      { new: true }
    );


    await MapComment.findByIdAndDelete(sCommentId);
    // return res.status(200).json(mapPost);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};


module.exports = {
  getAllMapComments: getAllMapComments,
  getMapComment: getMapComment,
  createMapComment: createMapComment,
  editMapComment: editMapComment,
  deleteMapComment: deleteMapComment,
  getAllExistingMapComments: getAllExistingMapComments
};
