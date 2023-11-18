import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/userSlice";
import { useSelector } from "react-redux";
import "./profile.css";
import { updateUserAPIMethod } from "../../api/client";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const userId = useSelector((state) => state.user.id);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${isAuth }` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [user]);

  if (!user) return null;

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const updateUser = async () => {
    updateUserAPIMethod(username, selectedFile, userId, isAuth)
      .then((res) => {
        setIsEditing(!isEditing);
      })
      .catch((err) => {
        console.error('Error updating user:', err.message);
      });
  }

  // const updateUser = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('image', selectedFile);
  //     formData.append('username', username);

  //     const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
  //       method: 'PUT',
  //       headers: { Authorization: `Bearer ${isAuth }` },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error updating user: ${response.statusText}`);
  //     }

  //     const responseData = await response.json();
  //     console.log('User updated successfully:', responseData.message);
  //     setIsEditing(!isEditing);
  //   } catch (error) {
  //   console.error('Error updating user:', error.message);
  //   }
  // };

  const handleClickEditUser = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_top">
          <div className="profile_left">
            <img
              alt=""
              className="profile_img"
              src={user.profile_img}
            ></img>
          </div>

          <div className="profile_right">
            <div className="username_container">
              <h5>Username</h5>
              {isEditing && (
                <div>
                  <div>
                    <label>Username: </label>
                    <input type="text" onChange={handleUsernameChange} />
                  </div>
                  <div>
                    <label>Choose Profile Image: </label>
                    <input type="file" onChange={handleFileChange} />
                  </div>
                  <button onClick={updateUser}>Update User</button>
                </div>
                // <Formik
                //   onSubmit={updateUser}
                //   initialValues={initialValuesUpdate}
                // >
                //   {({
                //     values,
                //     handleBlur,
                //     handleChange,
                //     handleSubmit,
                //     setFieldValue,
                //   }) => (
                //     <form onSubmit={handleSubmit}>
                //       <Box sx={{ backgroundColor: "lightblue" }}>
                //         <TextField
                //           label="Username"
                //           onBlur={handleBlur}
                //           value={values.username}
                //           onChange={handleChange}
                //           name="username"
                //         />
                //       </Box>

                //       <Box
                //         gridColumn="span 4"
                //         borderRadius="5px"
                //         p="1rem"
                //       >
                //         <Dropzone
                //           acceptedFiles=".jpg,.jpeg,.png"
                //           multiple={false}
                //           onDrop={(acceptedFiles) =>
                //             setFieldValue("profile_img", acceptedFiles[0])
                //           }
                //         >
                //           {({ getRootProps, getInputProps }) => (
                //             <Box
                //               {...getRootProps()}
                //               p="1rem"
                //               sx={{ "&:hover": { cursor: "pointer" } }}
                //             >
                //               <input {...getInputProps()} />
                //               {!values.profile_img ? (
                //                 <p>Add Picture Here</p>
                //               ) : (
                //                 <Typography>{values.profile_img.name}</Typography>
                //               )}
                //             </Box>
                //           )}
                //         </Dropzone>
                //       </Box>
            
                //       {/* BUTTONS */}
                //       <Box>
                //         <Button
                //           type="submit"
                //         >
                //           Update User
                //         </Button>
                //       </Box>
                //     </form>
                //   )}
                // </Formik>
              )}
              {!isEditing && (
                <div className="username">
                  {user.username}
                </div>
              )}
            </div>
            <div className="email_container">
              {!isEditing && (
                <>
                  <h5>Email</h5>
                  <div className="email">
                    {user.email}
                  </div>
                  </>
              )}
            </div>
          </div>
          {isEditing && (
            <button className="finish_edit_user_btn" >
              Update User
            </button>
          )}
          {!isEditing && (
            <button className="edit_user_btn" onClick={handleClickEditUser}>
              Edit info
            </button>
          )}
        </div>
        <div className="profile_bottom">
          <div className="logout" onClick={handleLogout}>
            logout
          </div>
          <div className="remove_account">remove account</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
