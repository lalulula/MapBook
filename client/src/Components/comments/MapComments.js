import { useState, useEffect } from "react";
import dummyComments from "./sample_data_comments.json";
import "./mapcomments.css";
import defaultImg from "../../assets/img/defaultProfileImg.jpg";
import { Button, Comment, CommentGroup, Form, Header } from "semantic-ui-react";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MapComments = () => {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyText, setReplyText] = useState(null);
  const [newReply, setNewReply] = useState('');

  const [sampleComments, setSampleComments] = useState([
    { _id: 1, user: 'bobby', comment: 'This is the first comment' },
    { _id: 2, user: 'sammy', comment: 'This is the second comment' },
  ]);

  const [sampleReplies, setSampleReplies] = useState([
    { _id: 1, user: 'jon', reply: 'reply to comment 1', commentId: 1 },
    { _id: 2, user: 'jill', reply: 'another reply to comment 1', commentId: 1 },
    { _id: 3, user: 'jass', reply: 'and again another reply to comment 1', commentId: 1 },
    { _id: 4, user: 'yunah', reply: 'reply to comment 2', commentId: 2 },
    { _id: 5, user: 'haneul', reply: 'another reply to comment 2', commentId: 2 },
  ])

  /* const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };
  //   https://react.semantic-ui.com/views/comment/#content-reply-form
  //will call get all comments api and then filter based on the mapId */

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const newCommentObject = {
        _id: sampleComments.length + 1,
        user: 'jill',
        comment: newComment,
      };
      setSampleComments([...sampleComments, newCommentObject]);
      setNewComment('');
    }
    //createCommentAPI(newCommentObject)
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = sampleComments.filter((comment) => comment._id !== commentId);
    setSampleComments(updatedComments);
    //deleteCommentAPI(commentId)
  };

  const handleClickEditComment = (commentId) => {
    setEditingCommentId(commentId);
    const commentToEdit = sampleComments.find((comment) => comment._id === commentId);
    setCommentText(commentToEdit.comment);
    //setIsEditingComment(!isEditingComment);
  }

  const handleEditCommentSave = (commentId) => {
    console.log("commentId: ", commentId);
    const updatedComments = sampleComments.map((comment) =>
      comment._id === commentId ? { ...comment, comment: commentText } : comment
    );
    setSampleComments(updatedComments);
    setEditingCommentId(null);
    //updateCommentAPI(commentId), won't need updatedComments variable
  }

  const handleReplyComment = (commentId) => {
    setReplyingCommentId(commentId);
    console.log(commentId);
  }

  const handleClickReplyComment = () => {
    if (replyText.trim() !== '') {
      const newReplyObject = {
        _id: sampleReplies.length + 1,
        user: 'sam',
        reply: replyText,
        commentId: replyingCommentId,
      };
      setSampleReplies([...sampleReplies, newReplyObject]);
      setReplyText('');
      setReplyingCommentId(null);
    }
    //createCommentAPI(newCommentObject)
  }

  /* useEffect(() => {
      getSocialCommentsAPI(id).then((c) => { //get comments that have social_post_id == id
          setComments(c);
      })dfdfdfdfjjj
  }, []); */

  return (
    <div className="map_comments">
      <div className="map_comments_container">
        <div>
          {sampleComments.map((comment) => (
            <div className="map_comment">
              <div className="map_comment_header">
                <img className="map_comment_profile_img" src={defaultImg} />
                <div className="user">user: {comment.user}</div>
              </div>
              {editingCommentId === comment._id ? (
                <div>
                  <textarea className="edit_comment_input" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                  <button className="save_comment_changes" onClick={() => handleEditCommentSave(comment._id)}>
                    save
                  </button>
                  <div className="map_comment_replies">
                    {sampleReplies.map((reply) => (
                      <div>
                        {reply.commentId == comment._id && (
                          <div className="map_comment_reply">
                            <div className="map_comment_reply_top">
                              <img className="map_comment_profile_img" src={defaultImg} />
                              {reply.user}
                            </div>
                            {reply.reply}
                          </div>
                        )}
                      </div>
                    )
                    )}
                  </div>
                  <div className="map_comment_bottom">
                    <div className="edit_comment_btn" onClick={() => handleClickEditComment(comment._id)}>
                      <EditIcon />
                      Edit comment
                    </div>
                    <div className="delete_comment_btn" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon />
                      Delete comment
                    </div>
                    <div className="delete_comment_btn" onClick={() => handleReplyComment(comment._id)}>
                      <ChatBubbleOutlineIcon />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{comment.comment}</p>
                  <div className="map_comment_replies">
                    {sampleReplies.map((reply) => (
                      <div>
                        {reply.commentId == comment._id && (
                          <div className="map_comment_reply">
                            <div className="map_comment_reply_top">
                              <img className="map_comment_profile_img" src={defaultImg} />
                              {reply.user}
                            </div>
                            {reply.reply}
                          </div>
                        )}
                      </div>
                    )
                    )}
                    {replyingCommentId === comment._id && (
                      <div>
                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                        <button onClick={() => handleClickReplyComment(comment._id)}>reply</button>
                      </div>
                    )}
                  </div>
                  <div className="map_comment_bottom">
                    <div className="edit_comment_btn" onClick={() => handleClickEditComment(comment._id)}>
                      <EditIcon />
                      Edit comment
                    </div>
                    <div className="delete_comment_btn" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon />
                      Delete comment
                    </div>
                    <div className="delete_comment_btn" onClick={() => handleReplyComment(comment._id)}>
                      <ChatBubbleOutlineIcon />
                      Reply
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="map_comments_bottom">
          <input
            id="map_comment"
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="map_comment_button" onClick={handleAddComment}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComments;
// import React from "react";
// import { Button, Comment, Form, Header } from "semantic-ui-react";

// const MapComments = () => (
//   <Comment.Group>
//     <Header as="h3" dividing>
//       Comments
//     </Header>

//     <Comment>
//       <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
//       <Comment.Content>
//         <Comment.Author as="a">Matt</Comment.Author>
//         <Comment.Metadata>
//           <div>Today at 5:42PM</div>
//         </Comment.Metadata>
//         <Comment.Text>How artistic!</Comment.Text>
//         <Comment.Actions>
//           <Comment.Action>Reply</Comment.Action>
//         </Comment.Actions>
//       </Comment.Content>
//     </Comment>

//     <Form reply>
//       <Form.TextArea />
//       <Button content="Add Reply" labelPosition="left" icon="edit" primary />
//     </Form>
//   </Comment.Group>
// );

// export default MapComments;
