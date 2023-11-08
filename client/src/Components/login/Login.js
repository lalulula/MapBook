import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, selectUser } from "../../features/userSlice";
import Register from "../register/Register";
import { loginUserAPIMethod } from "../../api/client";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  /* const handleLogin = (username, password) => {
    const user = { username, password };
    console.log("user: ", user);
    loginUserAPIMethod(user).then(() => setIsLoggedIn(true)).catch(err => {
      console.log("Unsuccessful login");
      setIsLoggedIn(false);
    });
  } */

  const dispatch = useDispatch();
  const onSubmit = async (e) => {
    //e.preventDefault();
    // console.log(user);,

    // dispatch(login({ username: e.username, password: e.password, }));
    // loginUserAPIMethod(user).then(() => setIsLoggedIn(true)).catch(err => {
    //   console.log("Unsuccessful login");
    //   setIsLoggedIn(false);
    // });
    //handleLogin(e.username, e.password);
    const loggedInResponse = await fetch(
      "http://localhost:3001/api/auth/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: e.username,
          password: e.password,
        }),
      }
    );
    const loggedIn = await loggedInResponse.json();
    if (loggedIn["token"] !== undefined) {
      dispatch(
        login({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/mainpage");
    }
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
      <Form onSubmit={handleSubmit(onSubmit)} className="login_form">
        <h1>Login</h1>
        <h6>Create and Share Your Maps</h6>
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
          {errors.password && (
            <p className="ui negative mini message">Password is required</p>
          )}
        </Form.Field>
        <Button
          type="submit"
          className="login_btn"
          /* onClick={() => handleLogin(username, password)} */
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Login;
