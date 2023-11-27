/* eslint-disable no-unused-vars */
import "./register.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserAPIMethod, signUpGoogleAPIMethod } from "../../api/auth";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";
import { SHA256, enc } from "crypto-js";
import Lottie from "lottie-react";
import landingData1 from "../../assets/Lottie/processIndic.json";

import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [failed, setFailed] = useState(false);
  const [registerLoading, setRegisterIsLoading] = useState(false);
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

  const onSubmit = (data) => {
    handleRegister(data.username, data.email, data.password, data.confirmPwd);
  };
  const handleRegister = (username, email, password, confirmPwd) => {
    let isAdmin = false;
    if (password !== confirmPwd) {
      setError("confirmPwd", {
        type: "manual",
        message: "Passwords must match",
      });
      return;
    }

    if (username.toLowerCase() === "admin") {
      isAdmin = true;
    }

    setRegisterIsLoading(true); // Set loading to true when starting the registration

    // encrypt password
    password = SHA256(password).toString(enc.Hex);
    const user = {
      username,
      email,
      password,
      is_admin: isAdmin,
      // Setting user default img
      profile_img:
        "https://res.cloudinary.com/dkzqcfizf/image/upload/v1700363108/laj5ucybdhzoa2wtkvkm.jpg",
    };
    createUserAPIMethod(user)
      .then((response) => {
        if (response.ok) {
          console.log("Successfully registered");
          navigate("/login");
        } else {
          console.log("Invalid register");
          setFailed(true);
        }
      })
      .catch((err) => {
        console.error("Error registering user:", err);
      })
      .finally(() => {
        setRegisterIsLoading(false);
      });
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const dispatch = useDispatch();

  const googleSuccess = async (res) => {
    console.log(res);

    const googlePassword = SHA256(res?.googleId).toString(enc.Hex);
    const user = {
      username: res?.profileObj.familyName + res?.profileObj.givenName,
      email: res?.profileObj.email,
      password: googlePassword,
      profile_img: res?.profileObj.imageUrl,
      isAdmin: username.toLowerCase() === "admin" ? true : false,
      googleAccessToken: res?.accessToken
    };
    createUserAPIMethod(user)
      .then((response) => {
        if (response.ok) {
          response.json().then((jsonResult) => {
            console.log("Successfully registered with Google");
            dispatch(login(jsonResult));
            navigate("/");
          });
        } else {
          console.log("Invalid register with Google");
          setFailed(true);
        }
      })
      .catch((err) => {
        console.error("Error registering user with Google:", err);
      })
      .finally(() => {
        setRegisterIsLoading(false);
      });
  };

  const googleFailure = (error) => {
    console.log(error);
    console.log("Google Sign In was unsuccessful.");
  };

  return (
    <div className="register">
      <Form onSubmit={handleSubmit(onSubmit)} className="register_form">
        <div className="register_form_top">
          <h1>Register</h1>
          <h5>You're almost there!</h5>
        </div>
        <Form.Field>
          <input
            type="text"
            placeholder="Username"
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
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            {...register(
              "email",
              { required: true },
              {
                pattern:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/,
              }
            )}
          />
          {errors.email && (
            <p className="ui negative mini message">
              Enter a valid email address
            </p>
          )}
        </Form.Field>
        <Form.Field>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            {...register("password", {
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
            })}
          />
          {errors.password && (
            <p className="ui negative mini message">
              Password must be between 6 and 15 characters in length with one
              uppercase, one lowercase letter, and one number
            </p>
          )}
        </Form.Field>

        <Form.Field>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPwd", { required: true })}
          />
          {errors.confirmPwd && (
            <p className="ui negative mini message">
              {errors.confirmPwd.message}
            </p>
          )}
        </Form.Field>
        <a href="/login" style={{ marginBottom: "15px", alignSelf: "end" }}>
          Already a Member?
        </a>

        {registerLoading ? (
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
            className="register_btn"
            style={{ marginBottom: "10px" }}
          >
            Sign Up
          </Button>
        )}

        <div className="google_divider">OR</div>
        {/* Google Sign-Up Button */}
        <GoogleLogin
          clientId = {process.env.REACT_APP_CLIENT_ID}
          render={(renderProps) => (
            <Button
              className="google_register_btn"
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              variant="contained"
            >
              <i className="bi bi-google" />
              Sign up with Google
            </Button>
          )}
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy="single_host_origin"
        />
        {failed && (
          <p className="ui negative mini message">
            Registration failed. Please check your information or enter a
            different username.
          </p>
        )}
      </Form>
    </div>
  );
};

export default Register;
