// import React, { useState, useEffect } from "react";
// import "./register.css";
// import { createUserAPIMethod } from '../../api/client';

// const Register = () => {
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [invalidRegMsg, setInvalidRegMsg] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleRegister = (username, password) => {
//     var admin = false;
//     if (name === "admin") {
//       admin = true;
//     }

//     const user = { username, password };
//     createUserAPIMethod(user).then(() => setIsLoggedIn(true)).catch(err => {
//       console.log("invalid register");
//       setInvalidRegMsg("Invalid email and/or password"); //yunah wants to add special message here
//       setIsLoggedIn(false);
//     });
//   }

//   /* useEffect(() => {
//     if (isLoggedIn) {
//       console.log("IS LOGGED IN");
//     } else {
//       console.log("NOT LOGGED IN");
//     }
//   }, [isLoggedIn]); */

//   return (
//     <div className="login">
//       <div className="login_form">
//         <h1>Register</h1>
//         <h6>You're almost there!</h6>
//         {/* <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         /> */}
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         {/* <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         /> */}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         {/* <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPwd}
//           onChange={(e) => setConfirmPwd(e.target.value)}
//         /> */}
//         <a href="#/">Already a Member?</a>
//         <button className="register_btn" onClick={() => handleRegister(username, password)}>
//           Sign Up
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Register;
import React, { useState, useEffect } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { createUserAPIMethod } from "../../api/client";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const handleRegister = (username, password, confirmPwd) => {
    if (password !== confirmPwd) {
      setError("confirmPwd", {
        type: "manual",
        message: "Passwords must match",
      });
      return; // Exit early if passwords don't match
    }

    var admin = false;
    if (name === "admin") {
      admin = true;
    }

    const user = { username, password };
    createUserAPIMethod(user)
      .then(() => {
        console.log("Successfully registered");
        setIsLoggedIn(true);
        navigate("/login");
      })
      .catch((err) => {
        console.log("Invalid register");
        setIsLoggedIn(false);
      });
  };

  const onSubmit = (data) => {
    handleRegister(data.username, data.password, data.confirmPwd);
  };

  return (
    <div className="login">
      <Form onSubmit={handleSubmit(onSubmit)} className="login_form">
        <h1>Register</h1>
        <h6>You're almost there!</h6>
        <Form.Field>
          <input
            type="text"
            placeholder="Name"
            // value={name}
            onChange={(e) => setName(e.target.value)}
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="ui negative mini message">Name is required</p>
          )}
        </Form.Field>
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
            type="email"
            placeholder="Email"
            // value={email}
            onChange={(e) => setEmail(e.target.value)}
            {...register("email", {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/,
            })}
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
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
            {...register("password", {
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
            })}
          />
          {errors.password && (
            <p className="ui negative mini message">
              Password must be between 6 and 15 characters in length with one
              uppercase and one lowercase letter
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
        <a href="#/">Already a Member?</a>
        <Button type="submit" className="register_btn">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Register;
