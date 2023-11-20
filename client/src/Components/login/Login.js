import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, selectUser } from "../../features/userSlice";
import Register from "../register/Register";
import { loginUserAPIMethod } from "../../api/auth";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import "./login.css";

import { SHA256, enc } from "crypto-js";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const clientId =
    "274154138703-j3eqfrs1bhlrndduc85b5dgk2ps9dtg4.apps.googleusercontent.com";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const dispatch = useDispatch();
  const handleLogin = async (credentialResponse) => {
    console.log(credentialResponse);
  };

  const onSubmit2 = async (user) => {
    user.password = SHA256(user.password).toString(enc.Hex);
    console.log(user);
    loginUserAPIMethod(user)
      .then((res) => {
        console.log("logged in!");
        res.json().then((jsonResult) => {
          // The result data which returned server
          // console.log(jsonResult);

          dispatch(login(jsonResult));
        });

        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log("Unsuccessful login");
        setIsLoggedIn(false);
        setErrorMessage("Incorrect username or password");
      });
    // console.log(response);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/mainpage");
    } else {
      console.log("user is NOT logged in in profile!");
    }
  }, [isLoggedIn]);
  return (
    <div className="login">
      <Form onSubmit={handleSubmit(onSubmit2)} className="login_form">
        <div className="login_form_top">
          <h1>Login</h1>
          <h6>Create and Share Your Maps</h6>
        </div>
        <Form.Field>
          <input
            type="text"
            placeholder="Username"
            // value={username}
            onChange={(e) => setUsername(e.target.value)}
            //include validation and error message
            {...register("username", { required: true })}
          />
          {errors.username && (
            <p className="ui negative mini message">Username is required</p>
          )}
        </Form.Field>
        <Form.Field>
          <input
            type="password"
            placeholder="Password"
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
            {...register("password", {
              required: true,
              //pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
            })}
          />
          <div className="invalid_credentials_error_message">
            {errorMessage}
          </div>
          {errors.password && (
            <p className="pwd_err ui negative mini message">
              Password is required
            </p>
          )}
        </Form.Field>
        <a href="/register" style={{ marginBottom: "15px", alignSelf: "end" }}>
          Don't have an account?
        </a>

        <Button
          type="submit"
          style={{ marginBottom: "10px" }}
          className="login_btn"
        >
          Login
        </Button>

        <div className="google_divider">OR</div>
        <Button
          type="submit"
          className="google_register_btn"
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <i className="bi bi-google" />
          Sign In With Google
        </Button>
      </Form>
    </div>
  );
};

export default Login;
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { login, selectUser } from "../../features/userSlice";
// import { loginUserAPIMethod } from "../../api/client";
// import { useForm } from "react-hook-form";
// import { Button, Form } from "semantic-ui-react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { SHA256, enc } from "crypto-js";
// import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import Register from "../register/Register";

// import "./login.css";
// const Login = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const clientId =
//     "274154138703-j3eqfrs1bhlrndduc85b5dgk2ps9dtg4.apps.googleusercontent.com";

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm();

//   const dispatch = useDispatch();
//   // Google Login

//   const [userInfo, setUserInfo] = useState([]);
//   const [profileInfo, setProfileInfo] = useState([]);
//   useEffect(() => {
//     if (userInfo) {
//       axios
//         .get(
//           `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`,
//           {
//             headers: {
//               Authorization: `Bearer ${userInfo.access_token}`,
//               Accept: "application/json",
//             },
//           }
//         )
//         .then((response) => {
//           setProfileInfo(response.data);
//           console.log(userInfo);
//         })
//         .catch((error) => console.log(error));
//     }
//   }, [userInfo]);
//   const responseOutput = (response) => {
//     console.log(response);
//   };
//   const logOut = () => {
//     googleLogout();
//     setProfileInfo(null);
//   };
//   const errorOutput = (error) => {
//     console.log(error);
//   };
//   const login = useGoogleLogin({
//     onSuccess: (response) => setUserInfo(response),
//     onError: (error) => console.log(`Login Failed: ${error}`),
//   });
//   const onSubmit2 = async (user) => {
//     user.password = SHA256(user.password).toString(enc.Hex);
//     console.log(user);
//     loginUserAPIMethod(user)
//       .then((res) => {
//         console.log("logged in!");
//         res.json().then((jsonResult) => {
//           // The result data which returned server
//           // console.log(jsonResult);

//           dispatch(login(jsonResult));
//         });

//         setIsLoggedIn(true);
//       })
//       .catch((err) => {
//         console.log("Unsuccessful login");
//         setIsLoggedIn(false);
//         setErrorMessage("Incorrect username or password");
//       });
//     // console.log(response);
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/mainpage");
//     } else {
//       console.log("user is NOT logged in in profile!");
//     }
//   }, [isLoggedIn]);
//   return (
//     <div className="login">
//       <Form onSubmit={handleSubmit(onSubmit2)} className="login_form">
//         <div className="login_form_top">
//           <h1>Login</h1>
//           <h6>Create and Share Your Maps</h6>
//         </div>
//         <Form.Field>
//           <input
//             type="text"
//             placeholder="Username"
//             // value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             //include validation and error message
//             {...register("username", { required: true })}
//           />
//           {errors.username && (
//             <p className="ui negative mini message">Username is required</p>
//           )}
//         </Form.Field>
//         <Form.Field>
//           <input
//             type="password"
//             placeholder="Password"
//             // value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             {...register("password", {
//               required: true,
//               //pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
//             })}
//           />
//           <div className="invalid_credentials_error_message">
//             {errorMessage}
//           </div>
//           {errors.password && (
//             <p className="pwd_err ui negative mini message">
//               Password is required
//             </p>
//           )}
//         </Form.Field>
//         <a href="/register">Don't have an account?</a>
//         <div>
//           <Button type="submit" className="login_btn">
//             Submit
//           </Button>
//           <GoogleLogin onSuccess={responseOutput} onError={errorOutput} />
//         </div>
//         {profileInfo ? (
//           <div>
//             <img src={profileInfo.picture} alt="Profile Image" />
//             <h3>Currently logged in user</h3>
//             <p>Name: {profileInfo.name}</p>
//             <p>Email: {profileInfo.email}</p>
//             <br />
//             <br />
//             <button onClick={logOut}>Log out</button>
//           </div>
//         ) : (
//           <button onClick={() => login()}>Sign in</button>
//         )}
//       </Form>
//     </div>
//   );
// };

// export default Login;
