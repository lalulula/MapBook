// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getSocialPostAPIMethod,
//   editSocialPostAPIMethod,
// } from "../../api/social";

// const EditSocialPost = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [editedPost, setEditedPost] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const currentPost = await getSocialPostAPIMethod(id);
//         setEditedPost(currentPost);
//       } catch (error) {
//         console.error("Error fetching social post:", error);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleEditSocialPost = async () => {
//     try {
//       // Call the API to update the social post
//       await editSocialPostAPIMethod(id, editedPost);

//       // Navigate back to the Social Post Details page
//       navigate(`/socialpage`);
//     } catch (error) {
//       console.error("Error updating social post:", error);
//       // Handle error (e.g., display an error message to the user)
//     }
//   };

//   const handleChange = (e) => {
//     // Update the editedPost state when form fields change
//     setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
//   };

//   return (
//     <div>
//       <h1>Edit Social Post</h1>
//       <form>
//         <label>Title:</label>
//         <input
//           type="text"
//           name="title"
//           value={editedPost.title || ""}
//           onChange={handleChange}
//         />

//         <label>Content:</label>
//         <textarea
//           name="post_content"
//           value={editedPost.post_content || ""}
//           onChange={handleChange}
//         />

//         <button type="button" onClick={handleEditSocialPost}>
//           Update Post
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditSocialPost;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSocialPostAPIMethod,
  editSocialPostAPIMethod,
} from "../../api/social";

const EditSocialPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editedPost, setEditedPost] = useState({
    title: "",
    post_content: "",
    topic: "",
    customTopic: "",
    post_images: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentPost = await getSocialPostAPIMethod(id);
        setEditedPost(currentPost);
      } catch (error) {
        console.error("Error fetching social post:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleEditSocialPost = async () => {
    try {
      // Call the API to update the social post
      await editSocialPostAPIMethod(id, editedPost);

      // Navigate back to the Social Post Details page
      navigate(`/socialpage`);
    } catch (error) {
      console.error("Error updating social post:", error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  const handleChange = (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Edit Social Post</h1>
      <form>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={editedPost.title || ""}
          onChange={handleChange}
        />

        <label>Content:</label>
        <textarea
          name="post_content"
          value={editedPost.post_content || ""}
          onChange={handleChange}
        />

        {/* Additional fields based on your form structure */}
        <label>Topic:</label>
        <input
          type="text"
          name="topic"
          value={editedPost.topic || ""}
          onChange={handleChange}
        />

        <label>Custom Topic:</label>
        <input
          type="text"
          name="customTopic"
          value={editedPost.customTopic || ""}
          onChange={handleChange}
        />

        {/* Handle post_images separately based on your structure */}

        <button type="button" onClick={handleEditSocialPost}>
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditSocialPost;
