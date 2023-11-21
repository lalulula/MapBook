import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/userSlice";
import { useSelector } from "react-redux";
import "./profile.css";
import { updateUserAPIMethod, removeUserAPIMethod } from "../../api/client";

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
      headers: { Authorization: `Bearer ${isAuth}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
    // console.log(user);
  }, [user]);
  useEffect(() => {
    // console.log(user);
  }, [user]);

  if (!user) return null;

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0])
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

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_top">
          <div className="profile_left">
            <img alt="" className="profile_img" src={user.profile_img}></img>
          </div>

          <div className="profile_right">
            <div className="username_container">
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
              )}
              {!isEditing && (
                <>
                  <h5>Username</h5>
                  <div className="username">{user.username}</div>
                </>
              )}
            </div>
            <div className="email_container">
              {!isEditing && (
                <>
                  <h5>Email</h5>
                  <div className="email">{user.email}</div>
                </>
              )}
            </div>
          </div>
          {isEditing && (
            <button className="finish_edit_user_btn">Update User</button>
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
          <div className="remove_account" onClick={handleRemoveUser}>
            remove account
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
