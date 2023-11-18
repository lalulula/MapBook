import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, selectUser } from "../../features/userSlice";
import Register from "../register/Register";
import { loginUserAPIMethod } from "../../api/client";
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
    <GoogleOAuthProvider clientId="274154138703-j3eqfrs1bhlrndduc85b5dgk2ps9dtg4.apps.googleusercontent.com">
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
          <a href="/register">Don't have an account?</a>
          <div>
            <Button type="submit" className="login_btn">
              Submit
            </Button>
            <GoogleLogin onSuccess={handleLogin} />
          </div>
        </Form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { loginUserAPIMethod } from "../../api/client";
// import { login } from "../../features/userSlice";
// import { useForm } from "react-hook-form";
// import { Button, Form } from "semantic-ui-react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { SHA256, enc } from "crypto-js";

// import "./login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const dispatch = useDispatch();

//   const handleLogin = async (data, googleResponse) => {
//     // Check if Google response is provided
//     if (googleResponse) {
//       console.log(googleResponse);
//       // Extract user information from Google response
//       const { profileObj, tokenId } = googleResponse;

//       // You can use the extracted user information for further processing
//       console.log(profileObj);

//       // Perform actions like dispatching login action or sending the user information to your server
//       // Example: Dispatch a login action using Redux
//       dispatch(
//         login({ name: profileObj.name, email: profileObj.email, tokenId })
//       );

//       try {
//         const user = {
//           username: googleResponse.profileObj.email,
//           password: SHA256(googleResponse.profileObj.googleId).toString(
//             enc.Hex
//           ),
//         };

//         // Perform login logic
//         await loginUserAPIMethod(user);
//         setIsLoggedIn(true);
//         navigate("/mainpage");
//       } catch (error) {
//         console.error("Error during Google login:", error);
//         setIsLoggedIn(false);
//         setErrorMessage("Google login failed");
//       }
//     } else {
//       // Handle the traditional login logic
//       try {
//         // Perform your traditional login logic using the 'data' object
//         console.log("Traditional login:", data);

//         // Example: Log in using username and password
//         const user = {
//           username: data.username,
//           password: SHA256(data.password).toString(enc.Hex),
//         };

//         await loginUserAPIMethod(user);
//         setIsLoggedIn(true);
//         navigate("/mainpage");
//       } catch (error) {
//         console.error("Error during traditional login:", error);
//         setIsLoggedIn(false);
//         setErrorMessage("Incorrect username or password");
//       }
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/mainpage");
//     }
//   }, [isLoggedIn]);

//   return (
//     <GoogleOAuthProvider clientId="274154138703-j3eqfrs1bhlrndduc85b5dgk2ps9dtg4.apps.googleusercontent.com">
//       <div className="login">
//         <Form onSubmit={handleSubmit(handleLogin)} className="login_form">
//           <div className="login_form_top">
//             <h1>Login</h1>
//             <h6>Create and Share Your Maps</h6>
//           </div>
//           <Form.Field>
//             <input
//               type="text"
//               placeholder="Username"
//               {...register("username", { required: true })}
//             />
//             {errors.username && (
//               <p className="ui negative mini message">Username is required</p>
//             )}
//           </Form.Field>
//           <Form.Field>
//             <input
//               type="password"
//               placeholder="Password"
//               {...register("password", { required: true })}
//             />
//             <div className="invalid_credentials_error_message">
//               {errorMessage}
//             </div>
//             {errors.password && (
//               <p className="pwd_err ui negative mini message">
//                 Password is required
//               </p>
//             )}
//           </Form.Field>
//           <a href="/register">Don't have an account?</a>
//           <div>
//             <Button type="submit" className="login_btn">
//               Submit
//             </Button>
//             <GoogleLogin onSuccess={(response) => handleLogin(null, response)}>
//               <Button type="button" className="google-login-btn">
//                 Log in with Google
//               </Button>
//             </GoogleLogin>
//           </div>
//         </Form>
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;
