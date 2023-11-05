import React, { useState, useEffect } from "react";
import "./register.css";
import { createUserAPIMethod } from '../../api/client';

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidRegMsg, setInvalidRegMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegister = (username, password) => {
    var admin = false;
    if (name === "admin") {
      admin = true;
    }

    const user = { username, password };
    createUserAPIMethod(user).then(() => setIsLoggedIn(true)).catch(err => {
      console.log("invalid register");
      setInvalidRegMsg("Invalid email and/or password"); //yunah wants to add special message here
      setIsLoggedIn(false);
    });
  }

  /* useEffect(() => {
    if (isLoggedIn) {
      console.log("IS LOGGED IN");
    } else {
      console.log("NOT LOGGED IN");
    }
  }, [isLoggedIn]); */

  return (
    <div className="login">
      <div className="login_form">
        <h1>Register</h1>
        <h6>You're almost there!</h6>
        {/* <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /> */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
        /> */}
        <a href="#/">Already a Member?</a>
        <button className="register_btn" onClick={() => handleRegister(username, password)}>
          Sign Up
        </button>
      </div>


    </div>
  );
};

export default Register;
