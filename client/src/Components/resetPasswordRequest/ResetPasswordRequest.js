import { useState } from "react";
import "./resetPasswordRequest.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";
import { resetPasswordRequestAPIMethod } from "../../api/auth";

const ResetPasswordRequest = () => {
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const handleResetPasswordRequest = async () => {
    setIsLoading(true);
    const email = {
      email: resetPasswordEmail,
    }

    resetPasswordRequestAPIMethod(email)
    .then((res) => {
      if (res.ok) {
        res.json().then((jsonResult) => {
          console.log("Email has been sent!");
          navigate(`/resetPasswordRequest/${jsonResult.userId}`);
        });
      } else if (res.status === 404) {
        console.log("Fail to send the email.");
        setErrorMessage("Incorrect email or the email does not exist.");
      } else if (res.status === 405) {
        console.log("Fail to send the email.");
        setErrorMessage("The account registered with this email has been signed up with Google, so the password can not be reset. Please sign in with Google.");
      } else {
        console.error("Fail to send the email.");
        setErrorMessage("Error occurs when trying to send the email.");
      }
    })
    .catch((err) => {
      console.error("Fail to send the email.");
      setErrorMessage("Error occurs when trying to send the email:", err);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="resetPasswordRequest">
      <Form className="resetPasswordRequest_form">
        <div className="resetPasswordRequest_form_top">
          <h1>Reset Password Request</h1>
        </div>
        <Form.Field>
          <input
            type="text"
            placeholder="Account Email Address"
            onChange={(e) => setResetPasswordEmail(e.target.value)}
          />
          {errorMessage && (
            <div className="pwd_err ui negative mini message">
              {errorMessage}
            </div>
          )}
        </Form.Field>

        <h5 style={{color: "GrayText", margin: "5px 0 20px 0"}}>Enter your account email address, and we will send you the token to reset your password.</h5>

        <div className="buttons" style={{display: "flex", justifyContent: "space-between"}}>
          <Button
            onClick={() => navigate("/login")}
            style={{ marginTop: "20px" }}
            content="Back to Login"
            primary
          />
          <Button
            type="submit"
            style={{ marginTop: "20px" }}
            disabled={isLoading}
            onClick={handleResetPasswordRequest}
            inverted
            primary
          >
            {isLoading ? 'Loading...' : "Send"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ResetPasswordRequest;