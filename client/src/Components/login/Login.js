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

  const dispatch = useDispatch();

  const onSubmit2 = async (user) => {
    loginUserAPIMethod(user)
      .then((userData) => {
        console.log("logged in!");
        dispatch(login(user));
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log("Unsuccessful login");
        setIsLoggedIn(false);
        setErrorMessage("Incorrect username or password");
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
          <div>{errorMessage}</div>
          {errors.password && (
            <p className="ui negative mini message">Password is required</p>
          )}
        </Form.Field>
        <div>
          <Button type="submit" className="login_btn">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
