import { useState, useEffect } from "react";
import { getUserAPIMethod } from "../../api/client";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/userSlice";
import { useSelector } from "react-redux";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUsername = useSelector((state) => state.user.username);
  const currentName = useSelector((state) => state.user.name);
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const userId = useSelector((state) => state.user.id);

  console.log("current user' username: ", currentUsername);
  console.log("is authenticated: ", isAuth);

  //add username and name usestates : getting current user
  useEffect(() => {
    getUserAPIMethod(userId).then((userData) => {
      //   console.log("user set in profile.js", userData);
      setUsername(userData.username);
      setName(userData.name);
      setUser(userData.user);
      setEmail(userData.email);
    });
  }, [user]);

  const handleClickEditUser = () => {
    setIsEditing(!isEditing);
  };

  const handleClickSave = () => {
    console.log(username, name); // data that has to be updated
    console.log("Editing and saving data in DB");
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  // set username and name using useeffect. May not be able to use user.username and user.name

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_top">
          <div className="profile_left">
            <img
              alt=""
              className="profile_img"
              src="https://us-tuna-sounds-images.voicemod.net/d347dbc8-e6b8-4f85-bb64-8dcb234f5730-1674067639225.jpg"
            ></img>
            <div className="editImg">Upload/Change</div>
          </div>

          <div className="profile_right">
            <div className="username_container">
              <h5>Username</h5>
              {isEditing && (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
              {!isEditing && (
                <div className="username">
                  {currentUsername && <div>{currentUsername}</div>}
                  {!currentUsername && <div>{username}</div>}
                </div>
              )}
            </div>
            <div className="name_container">
              <h5>Name</h5>
              {isEditing && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              {!isEditing && (
                <div className="name">
                  {currentName && <div>{currentName}</div>}
                  {!currentName && <div>{name}</div>}
                </div>
              )}
            </div>
            {/* <div className="name_container">
              <h5>Name</h5>
              {isEditing && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              {!isEditing && <div className="name">{name}</div>}
            </div> */}
            <div className="email_container">
              <h5>Email</h5>
              <div className="email">
                <div>{email}</div>
              </div>
            </div>
          </div>
          {isEditing && (
            <button className="finish_edit_user_btn" onClick={handleClickSave}>
              save
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
