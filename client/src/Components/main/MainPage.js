import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import dumMapJsonData from "./dum_data.json";
import "./main.css";
import MapPreview from "../mappreview/MapPreview";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchBar from "../searchbar/SearchBar";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="main_container">
      <SearchBar />
      <div className="main_maps_container">
        {dumMapJsonData.map((item, index) => (
          <MapPreview key={index} data={item} />
        ))}
        <div onClick={() => handleLogout()}>LOGOUT</div>
      </div>
    </div>
  );
};

export default MainPage;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logout, selectUser } from "../../features/userSlice";
// import { getUserAPIMethod } from "../../api/client";
// import "./main.css";
// import { updateUserAPIMethod } from "../../api/client";
// import { useForm } from "react-hook-form";
// import { Button, Form } from "semantic-ui-react";
// import { useNavigate } from "react-router-dom";

// const MainPage = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const user = useSelector(selectUser);
//   const dispatch = useDispatch();
//   const handleLogout = () => {
//     dispatch(logout());
//     console.log(user);
//     navigate("/");
//   };
//   const {
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm();

//   const onSubmit = async (e) => {
//     console.log(e);
//     const loggedInResponse = await fetch(
//       "http://localhost:3001/api/auth/user",
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         method: "PUT",
//         body: JSON.stringify({
//           username: username,
//           password: password,
//         }),
//       }
//     ).then((response) => {
//       console.log("Updated a username");
//     });
//   };

//   return (
//     <div className="main">
//       <div className="main_container">Edit your password here:</div>
//       <Form onSubmit={onSubmit} className="update_form">
//         <Form.Field>
//           <input
//             type="text"
//             placeholder="Enter your username"
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </Form.Field>
//         <Form.Field>
//           <input
//             type="text"
//             placeholder="new password"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </Form.Field>
//         <Button type="submit" className="login_btn">
//           update
//         </Button>
//       </Form>
//       <div onClick={() => handleLogout()}>LOGOUT</div>
//     </div>
//   );
// };

// export default MainPage;
