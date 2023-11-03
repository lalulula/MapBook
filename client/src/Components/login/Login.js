import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
import Register from "../register/Register";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: email, password: password }));
  };
  return (
    <div className="login">
      <form className="login_form" onSubmit={handleSubmit}>
        <div className="login_form_top">
          <h1>Login</h1>
          <h6>Create and Share Your Maps</h6>
        </div>

        <a href="#/">Not a Member?</a>
        <div className="login_form_middle">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login_btn">
            Login
          </button>
        </div>
        <a href="#/">Forgot password?</a>
        <div className="bottomLine">
          <hr></hr>

        </div>
        <button>Login with Google</button>
      </form>
    </div>
  );
};

export default Login;
