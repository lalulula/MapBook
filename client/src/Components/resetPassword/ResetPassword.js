import { useState, useEffect } from "react";
import "./resetPassword.css";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";
import { SHA256, enc } from "crypto-js";
import { validateResetTokenAPIMethod, resetPasswordAPIMethod } from "../../api/auth";
import policeSecurity from "../../assets/img/police_security.png"
import emailSent from "../../assets/img/emailSent.png"

const ResetPassword = () => {
  const [resetPassword, setResetPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { resetToken, userId } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  useEffect(() => {
    const token = {
      resetToken: resetToken,
      userId: userId
    }
    validateResetTokenAPIMethod(token)
      .then((res) => {
        if (res.ok) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      }).catch((err) => {
        console.error(err);
        setIsValidToken(false);
      })
  }, [resetToken]);

  const handleResetPassword = (data) => {
    const resetPassword = data.resetPassword;
    const confirmPassword = data.confirmPassword;
    if (resetPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords must match",
      });
      return;
    }

    // encrypt password
    const resetPasswordHash = SHA256(resetPassword).toString(enc.Hex);
    const password = {
      userId,
      resetToken,
      resetPassword: resetPasswordHash
    };

    resetPasswordAPIMethod(password)
      .then((response) => {
        if (response.ok) {
          console.log("Successfully resetted the password.");
          setIsSuccess(true);
        } else {
          console.log("Fail to reset the password.");
          setIsSuccess(false);
        }
      })
      .catch((err) => {
        console.error("Error resetting password:", err);
      })
  };

  return (
    <>
      {isSuccess ? (
        <div className="success">
          <div className="desc">
            <div className="desc_title">Hooray, your password has been reset!</div>
            <div className="desc_detail">You can now login with your new password.</div>
            <div className="desc_buttons">
              <Button
                onClick={() => navigate("/login")}
                style={{ margin: "40px 30px 0 0" }}
                primary
              >
                Back to Login Page
              </Button>
            </div>
          </div>
          <div className="image">
            <img src={emailSent}></img>
          </div>
        </div>
      ) : isValidToken ? (
        <div className="resetPassword">
          <Form className="resetPassword_form" onSubmit={handleSubmit(handleResetPassword)}>
            <div className="resetPassword_form_top">
              <h1>Reset Password</h1>
            </div>
            <Form.Field>
              <input
                type="password"
                placeholder="New Password"
                onChange={(e) => setResetPassword(e.target.value)}
                {...register("resetPassword", {
                  required: true,
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
                })}
              />
              {errors.resetPassword && (
                <p className="ui negative mini message">
                  Password must be between 6 and 15 characters in length with one
                  uppercase, one lowercase letter, and one number
                </p>
              )}
            </Form.Field>
    
            <Form.Field>
              <input
                type="password"
                placeholder="Confirm New Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                {...register("confirmPassword", { required: true })}
              />
              {errors.confirmPassword && (
                <p className="ui negative mini message">
                  {errors.confirmPassword.message}
                </p>
              )}
            </Form.Field>
    
            <h5 style={{color: "GrayText", margin: "5px 0 20px 0"}}>Enter your new password and confirm the new password.</h5>
    
            <div className="buttons" style={{display: "flex", justifyContent: "space-between"}}>
              <Button
                onClick={() => navigate("/login")}
                style={{ marginTop: "20px" }}
                primary
              >
                Back to Login
              </Button>
              <Button
                type="submit"
                style={{ marginTop: "20px" }}
                inverted
                primary
              >
                Send
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="failed_token">
          <div className="desc">
            <div className="desc_title">Hold Up!</div>
            <div className="desc_detail">Sorry, but you are not authorized to veiw this page due to invalid submitted token.</div>
            <div className="desc_buttons">
              <Button
                onClick={() => navigate("/login")}
                style={{ margin: "40px 30px 0 0" }}
                primary
              >
                Back to Login Page
              </Button>
              <Button
                onClick={() => navigate(`/resetPasswordRequest/${userId}`)}
                style={{ margin: "40px 30px 0 0" }}
                inverted
                primary
              >
                Resubmit the Token
              </Button>
            </div>
          </div>
          <div className="image">
            <img src={policeSecurity}></img>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;