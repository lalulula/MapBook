import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser, getUser } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

import "./main.css";
import dumImg from "../../assets/img/dum.jpg";
import dumMapJsonData from "./dum_data.json";

const MainPage = () => {
  const userInfo = useSelector(getUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const user = userInfo;
    console.log(user.payload.user);
  }, [userInfo]);
  const navigate = useNavigate();
  // const user1 = useSelector(selectUser);
  const handleLogout = () => {
    dispatch(logout());
    // console.log(user);
    navigate("/");
  };

  return (
    <div className="main">
      {/* <div onClick={() => handleLogout()}>LOGOUT</div> */}
      {dumMapJsonData.map((item, index) => (
        <Card key={index} data={item} defaultImg={dumImg} />
      ))}
    </div>
  );
};

export default MainPage;

const Card = ({ data, defaultImg }) => {
  return (
    <div className="card">
      <img src={data.map_img ? data.map_img : defaultImg} alt={data.map_name} />
      <h3>{data.map_name}</h3>
      <p>{data.topic}</p>
      <p>Liked by {data.map_users_liked} users</p>
      <p>{data.map_comment_count} comments</p>
    </div>
  );
};
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
