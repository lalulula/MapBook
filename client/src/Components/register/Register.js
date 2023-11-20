/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { createUserAPIMethod } from "../../api/auth";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";

import { SHA256, enc } from "crypto-js";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [failed, setFailed] = useState(false);

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
      return; // Exit early if passwords don't match
    }

    if (username.toLowerCase() === "admin") {
      isAdmin = true;
    }

    // encrypt password
    password = SHA256(password).toString(enc.Hex);
    const user = { username, email, password, isAdmin };
    console.log(user.isAdmin);
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
      });
  };

  return (
    <div className="login">
      <Form onSubmit={handleSubmit(onSubmit)} className="login_form">
        <div className="login_form_top">
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

        <Button
          type="submit"
          className="register_btn"
          style={{ marginBottom: "10px" }}
        >
          Submit
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
