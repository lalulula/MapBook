// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../../features/userSlice";
// import { useSelector } from "react-redux";
// import "./profile.css";
// import { updateUserAPIMethod, removeUserAPIMethod } from "../../api/user";
// import Popup from "reactjs-popup";

// export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
// export const HOME_URL = process.env.REACT_APP_HOME_URL;

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [username, setUsername] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const isAuth = useSelector((state) => state.user.isAuthenticated);
//   const userId = useSelector((state) => state.user.id);

//   const getUser = async () => {
//     const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${isAuth}` },
//     });
//     const data = await response.json();
//     setUser(data);
//   };

//   useEffect(() => {
//     getUser();
//   }, [user]);

//   if (!user) return null;

//   const handleUsernameChange = (event) => {
//     setUsername(event.target.value);
//   };

//   const handleFileChange = (event) => {
//     console.log(event.target.files[0]);
//     setSelectedFile(event.target.files[0]);
//   };

//   const updateUser = async () => {
//     updateUserAPIMethod(username, selectedFile, userId, isAuth).catch((err) => {
//       console.error("Error updating user:", err.message);
//     });
//     setIsEditing(!isEditing);
//   };

//   const handleRemoveUser = async () => {
//     removeUserAPIMethod(userId, isAuth)
//       .then(() => {
//         handleLogout();
//       })
//       .catch((err) => {
//         console.error("Error removing user:", err.message);
//       });
//   };

//   const handleClickEditUser = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <div className="profile">
//       <div className="profile_container">
//         <div className="profile_top">
//           <div className="profile_left">
//             <img alt="" className="profile_img" src={user.profile_img}></img>
//           </div>

//           <div className="profile_right">
//             <div className="username_container">
//               {isEditing && (
//                 <div>
//                   <div>
//                     <label>Username: </label>
//                     <input type="text" onChange={handleUsernameChange} />
//                   </div>
//                   <div>
//                     <label>Choose Profile Image: </label>
//                     <input type="file" onChange={handleFileChange} />
//                   </div>
//                   <button onClick={updateUser}>Update User</button>
//                 </div>
//               )}
//               {!isEditing && (
//                 <>
//                   <h5>Username</h5>
//                   <div className="username">{user.username}</div>
//                 </>
//               )}
//             </div>
//             <div className="email_container">
//               {!isEditing && (
//                 <>
//                   <h5>Email</h5>
//                   <div className="email">{user.email}</div>
//                 </>
//               )}
//             </div>
//           </div>

//           {!isEditing && (
//             <button className="edit_user_btn" onClick={handleClickEditUser}>
//               Edit info
//             </button>
//           )}
//         </div>
//         <div className="profile_bottom">
//           <Popup
//             trigger={
//               <div className="logout" onClick={handleLogout}>
//                 logout
//               </div>
//             }
//             modal
//             nested
//             closeOnDocumentClick={false}
//             closeOnEscape={false}
//           >
//             {(close) => (
//               <div className="back2profile_modal">
//                 <div className="back2profile_modal_content">
//                   <h3>Are You Sure You Want To Logout?</h3>
//                 </div>

//                 <div className="modal_btn_container">
//                   <button onClick={handleLogout}>Logout</button>
//                   <button onClick={() => close()}>Keep Me Signed In</button>
//                 </div>
//               </div>
//             )}
//           </Popup>
//           <Popup
//             trigger={<div className="remove_account">remove account</div>}
//             modal
//             nested
//             closeOnDocumentClick={false}
//             closeOnEscape={false}
//           >
//             {(close) => (
//               <div className="back2profile_modal">
//                 <div className="back2profile_modal_content">
//                   <h3>
//                     Are You Sure You Want To Remove Your Account?
//                     <br />
//                     This Action Cannot Be Undone.
//                   </h3>
//                 </div>

//                 <div className="modal_btn_container">
//                   <button onClick={handleRemoveUser}>Remove Account</button>
//                   <button onClick={() => close()}>Keep My Account</button>
//                 </div>
//               </div>
//             )}
//           </Popup>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/userSlice";
import { useSelector } from "react-redux";
import "./profile.css";
import { updateUserAPIMethod, removeUserAPIMethod } from "../../api/user";
import Popup from "reactjs-popup";
import Input from "@mui/joy/Input";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import FormLabel from "@mui/joy/FormLabel";
export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

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
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${isAuth}` },
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
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const updateUser = async () => {
    updateUserAPIMethod(username, selectedFile, userId, isAuth).catch((err) => {
      console.error("Error updating user:", err.message);
    });
    setIsEditing(!isEditing);
  };

  const handleRemoveUser = async () => {
    removeUserAPIMethod(userId, isAuth)
      .then(() => {
        handleLogout();
      })
      .catch((err) => {
        console.error("Error removing user:", err.message);
      });
  };

  const handleClickEditUser = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_top">
          <div className="profile_left">
            <img alt="" className="profile_img" src={user.profile_img}></img>
            {isEditing && (
              // <div>
              //   <label>Choose Profile Image: </label>
              //   <input type="file" onChange={handleFileChange} />
              // </div>
              <Button
                className="change_profileImg_btn"
                style={{ backgroundColor: "transparent", marginTop: "1rem" }}
                component="label"
                variant="contained"
                startIcon={<i className="bi bi-person-square"></i>}
              >
                Change Profile Image
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            )}
          </div>

          <div className="profile_right">
            <div className="username_container">
              <div>
                <FormLabel
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1.5rem",
                  }}
                >
                  <h2 style={{ margin: 0 }}>Username</h2>
                  {!isEditing && (
                    <i
                      className="bi bi-pencil"
                      onClick={handleClickEditUser}
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  )}
                </FormLabel>
                <Input
                  onChange={handleUsernameChange}
                  color="neutral"
                  disabled={isEditing ? false : true}
                  placeholder="username"
                  size="lg"
                  variant="soft"
                  value={user.username}
                  className="username"
                  style={
                    isEditing
                      ? {
                          fontSize: "2rem",
                        }
                      : {
                          padding: 0,
                          background: "transparent",
                          fontSize: "2rem",
                        }
                  }
                />
              </div>
            </div>
            <div className="email_container">
              <div>
                <FormLabel style={{ color: "white" }}>
                  <h2>Email</h2>
                </FormLabel>
                <Input
                  className="email"
                  color="neutral"
                  disabled={isEditing ? false : true}
                  placeholder="username"
                  size="lg"
                  variant="soft"
                  value={user.email}
                  style={
                    isEditing
                      ? {
                          fontSize: "2rem",
                        }
                      : {
                          padding: 0,
                          background: "transparent",
                          fontSize: "2rem",
                        }
                  }
                />
              </div>
            </div>
            {isEditing && (
              <button
                style={{
                  marginTop: "2rem",
                  backgroundColor: "rgba(226, 226, 226, 0.284)",
                }}
                onClick={updateUser}
              >
                Update User
              </button>
            )}
          </div>

          {/* {!isEditing && (
            <button className="edit_user_btn" onClick={handleClickEditUser}>
              Edit info
            </button>
          )} */}
        </div>
        <div className="profile_bottom">
          <Popup
            trigger={
              <div className="logout" onClick={handleLogout}>
                logout
              </div>
            }
            modal
            nested
            closeOnDocumentClick={false}
            closeOnEscape={false}
          >
            {(close) => (
              <div className="back2profile_modal">
                <div className="back2profile_modal_content">
                  <h3>Are You Sure You Want To Logout?</h3>
                </div>

                <div className="modal_btn_container">
                  <button onClick={handleLogout}>Logout</button>
                  <button onClick={() => close()}>Keep Me Signed In</button>
                </div>
              </div>
            )}
          </Popup>
          <Popup
            trigger={<div className="remove_account">remove account</div>}
            modal
            nested
            closeOnDocumentClick={false}
            closeOnEscape={false}
          >
            {(close) => (
              <div className="back2profile_modal">
                <div className="back2profile_modal_content">
                  <h3>
                    Are You Sure You Want To Remove Your Account?
                    <br />
                    This Action Cannot Be Undone.
                  </h3>
                </div>

                <div className="modal_btn_container">
                  <button onClick={handleRemoveUser}>Remove Account</button>
                  <button onClick={() => close()}>Keep My Account</button>
                </div>
              </div>
            )}
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default Profile;
