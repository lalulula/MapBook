import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUsername } from "../../features/userSlice";
import { useSelector } from "react-redux";
import "./profile.css";
import { updateUserAPIMethod, removeUserAPIMethod } from "../../api/user";
import Popup from "reactjs-popup";
import Input from "@mui/joy/Input";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormLabel from "@mui/joy/FormLabel";
import UpdateUserButton from "../widgets/UpdateUserButton";
export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImg, setSelectedImg] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const userId = useSelector((state) => state.user.id);
  const currentUser = useSelector((state) => state.user.user);
  const [errorMessage, setErrorMessage] = useState(null);
  console.log(username);

  useEffect(() => {
    setUser(currentUser);
    setUsername(currentUser.username);
    //  For cypress test
    window.userState = currentUser;
  }, [user]);

  useEffect(() => {}, [selectedFile, selectedImg]);

  if (!user) return null;

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files["0"]);
    setSelectedImg(URL.createObjectURL(event.target.files[0]));
  };

  const updateUser = async () => {
    const updatedUser = await updateUserAPIMethod(
      username,
      selectedFile,
      userId,
      isAuth
    );
    if (updatedUser) {
      const payload = {
        username: username,
        profile_img: updatedUser.profile_img,
      };
      dispatch(updateUsername(payload));
  
      setIsEditing(!isEditing);
    } else {
      console.log("error");
      setErrorMessage("Username already existed");
    }
  };

  const handleRemoveUser = async () => {
    removeUserAPIMethod(userId, isAuth)
      .then(() => {
        handleLogout();
      })
      .catch((err) => {
        // console.error("Error removing user:", err.message);
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
            <img
              alt=""
              className="profile_img"
              src={selectedImg ? selectedImg : currentUser.profile_img}
            ></img>
            {isEditing && (
              <div className="cypress_click_profile">
                <Button
                  className="change_profileImg_btn"
                  style={{
                    backgroundColor: "transparent",
                    marginTop: "1rem",
                    textDecoration: "underline",
                  }}
                  component="label"
                  variant="contained"
                >
                  Change Profile Image
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              </div>
            )}
          </div>

          <div className="profile_right">
            <div className="username_container">
              <div style={{ alignItems: "center", textAlign: "center" }}>
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
                      className="edit_profile_btn bi bi-pencil"
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
                  value={username}
                  // defaultValue={currentUser.username}
                  className="username"
                  style={
                    isEditing
                      ? {
                          fontSize: "13px",
                        }
                      : {
                          padding: 0,
                          background: "transparent",
                          fontSize: "2rem",
                        }
                  }
                />
                {errorMessage && (
                  <div 
                    style={{
                      color: '#d9534f',
                      padding: '5px',
                      margin: '10px 0 0 0',
                      fontSize: '12px',
                      width: '20rem',
                      textAlign: 'left',
                    }}
                  >
                    {errorMessage}
                  </div>
                )}
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
                  disabled={isEditing ? true : true}
                  placeholder="username"
                  size="lg"
                  variant="soft"
                  value={user.email}
                  style={
                    isEditing
                      ? {
                          fontSize: "13px",
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <UpdateUserButton
                  onClick={() => {setIsEditing(false); setErrorMessage(null); setSelectedImg(null); setUsername(currentUser.username)}}
                  text={"Cancel"}
                />
                <UpdateUserButton onClick={updateUser} text={"Update User"} />
              </div>
            )}
          </div>
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
                  <button onClick={handleLogout} className="profile_logout_btn">
                    Logout
                  </button>
                  <button
                    onClick={() => close()}
                    className="profile_signedin_btn"
                  >
                    Keep Me Signed In
                  </button>
                </div>
              </div>
            )}
          </Popup>
          <Popup
            trigger={
              user.username !== "Admin" ? (
                <div className="remove_account">remove account</div>
              ) : (
                <></>
              )
            }
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
                  <button
                    onClick={handleRemoveUser}
                    className="profile_remove_btn"
                  >
                    Remove Account
                  </button>
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
