import "./login.css";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
import { loginUserAPIMethod, createUserAPIMethod } from "../../api/auth";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import landingData1 from "../../assets/Lottie/ProcessIndicator.json";

import { GoogleLogin } from "@react-oauth/google";

import { SHA256, enc } from "crypto-js";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginLoading, setLoginIsLoading] = useState(false);
  const style = {
    height: 50,
    width: 50,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit2 = async (user) => {
    setLoginIsLoading(true);
    user.password = SHA256(user.password).toString(enc.Hex);

    loginUserAPIMethod(user)
      .then((res) => {
        if (res.ok) {
          res.json().then((jsonResult) => {
            dispatch(login(jsonResult));
            setIsLoggedIn(true);
          });
        } else {
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
      // console.log("user is NOT logged in in profile!");
    }
  }, [isLoggedIn]);

  const googleSuccess = async (res) => {
    const req = {
      googleCredential: res.credential,
      clientId: process.env.REACT_APP_CLIENT_ID,
    };

    setLoginIsLoading(true);

    loginUserAPIMethod(req)
      .then((res) => {
        if (res.ok) {
          res.json().then((jsonResult) => {
            dispatch(login(jsonResult));
            setIsLoggedIn(true);
          });
        } else {
          // if a user sign in with a valid google acc but hasn't been existed in the DB yet, it will automatically signs that google account up and sign in
          console.error(
            "This Google account hasn't been signed up yet. This Google account will be signed up automatically."
          );
          createUserAPIMethod(req)
            .then((response) => {
              if (response.ok) {
                response.json().then((jsonResult) => {
                  dispatch(login(jsonResult));
                  navigate("/");
                });
              } else {
                console.error("Invalid login with Google");
              }
            })
            .catch((err) => {
              console.error("Error signing in with Google:", err);
              setIsLoggedIn(false);
              setErrorMessage("Google sign in failed. Please try again.");
            });
        }
      })
      .catch((err) => {
        console.error("Error during login with Google:", err);
        setIsLoggedIn(false);
        setErrorMessage("Something went wrong during login with Google");
      })
      .finally(() => {
        setLoginIsLoading(false);
      });
  };

  const googleFailure = (error) => {
    // console.log(error);
    // console.log("Google Sign In was unsuccessful.");
  };

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
          {errorMessage && (
            <div className="pwd_err ui negative mini message">
              {errorMessage}
            </div>
          )}
          {errors.password && (
            <p className="pwd_err ui negative mini message">
              Password is required
            </p>
          )}
        </Form.Field>
        <a
          href="/resetPasswordRequest"
          style={{ marginBottom: "15px", alignSelf: "end" }}
        >
          Forgot Password?
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
        {/* Google Sign-In Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <GoogleLogin
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            theme="filled_blue"
            text="signin_with"
            width="100px"
          />
        </div>

        <div
          className="no_account"
          style={{ marginTop: "40px", alignSelf: "center", display: "flex" }}
        >
          <a href="/register" style={{ marginRight: "10px" }}>
            Don't have an account?
          </a>
          <a
            href="/register"
            style={{ color: "whitesmoke", fontWeight: "bold" }}
          >
            Sign Up
          </a>
        </div>
      </Form>
    </div>
  );
};

export default Login;
