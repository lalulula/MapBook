import "./login.css";
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
import Lottie from "lottie-react";
import landingData1 from "../../assets/Lottie/processIndic.json";

import { SHA256, enc } from "crypto-js";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const clientId =
    "274154138703-j3eqfrs1bhlrndduc85b5dgk2ps9dtg4.apps.googleusercontent.com";
  const [loginLoading, setLoginIsLoading] = useState(false);
  const style = {
    height: 50,
    width: 50,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const dispatch = useDispatch();
  // const handleLogin = async (credentialResponse) => {
  //   console.log(credentialResponse);
  // };

  const onSubmit2 = async (user) => {
    setLoginIsLoading(true);
    user.password = SHA256(user.password).toString(enc.Hex);
    console.log(user);

    loginUserAPIMethod(user)
      .then((res) => {
        if (res.ok) {
          res.json().then((jsonResult) => {
            console.log("logged in!");
            dispatch(login(jsonResult));
            setIsLoggedIn(true);
          });
        } else {
          console.log("Unsuccessful login");
          setIsLoggedIn(false);
          setErrorMessage("Incorrect username or password");
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        setIsLoggedIn(false);
        setErrorMessage("Something went wrong during login");
      })
      .finally(() => {
        setLoginIsLoading(false);
      });
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
          <div className="pwd_err ui negative mini message">{errorMessage}</div>
          {errors.password && (
            <p className="pwd_err ui negative mini message">
              Password is required
            </p>
          )}
        </Form.Field>
        <a href="/register" style={{ marginBottom: "15px", alignSelf: "end" }}>
          Don't have an account?
        </a>

        {loginLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Lottie animationData={landingData1} style={style} />
          </div>
        ) : (
          <Button
            type="submit"
            style={{ marginBottom: "10px" }}
            className="login_btn"
          >
            Login
          </Button>
        )}

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
