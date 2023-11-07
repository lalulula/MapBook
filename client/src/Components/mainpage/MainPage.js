import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../features/userSlice";
import { getUserAPIMethod } from "../../api/client";
import "./main.css";
import { updateUserAPIMethod } from "../../api/client";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";


const MainPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (e) => {
    console.log(e);
    const loggedInResponse = await fetch('http://localhost:3001/api/auth/user', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then((response) => {
      console.log("Updated a username");
    });
  };

  return (
    <div className="main">
      <div className="main_container">
        Edit your password here:
      </div>
      <Form onSubmit={onSubmit} className="update_form">
        <Form.Field>
          <input
            type="text"
            placeholder="Enter your username"
            // value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <input
            type="text"
            placeholder="new password"
            // value={username}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        <Button
          type="submit"
          className="login_btn"
        /* onClick={() => handleLogin(username, password)} */
        >update</Button>
      </Form>
    </div>
  );
};

export default MainPage;
