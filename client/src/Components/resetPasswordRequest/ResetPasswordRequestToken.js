import { useState } from "react";
import "./resetPasswordRequest.css";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form } from "semantic-ui-react";

const ResetPasswordRequestToken = () => {
  const [resetToken, setResetToken] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const {
    formState: { errors },
  } = useForm();

  const handleSendToken = () => {
    if (resetToken === "") {
      setErrorMessage("Token must not be empty.")
    } else {
      navigate(`/resetPassword/${resetToken}/${userId}`)
    }
  };

  return (
    <div className="resetPasswordRequest">
      <Form className="resetPasswordRequest_form">
        <div className="resetPasswordRequest_form_top">
          <h1>Email has been sent! <br></br> Please check your inbox and spam folder.</h1>
        </div>
        <Form.Field>
          <input
            type="text"
            placeholder="Token"
            onChange={(e) => setResetToken(e.target.value)}
          />
          {errorMessage && (
            <div className="pwd_err ui negative mini message">
              {errorMessage}
            </div>
          )}
        </Form.Field>

        <h5 style={{color: "GrayText", margin: "5px 0 20px 0"}}>Enter the token from your received email.</h5>

        <div className="buttons" style={{display: "flex", justifyContent: "space-between"}}>
          <Button
            onClick={() => navigate("/login")}
            style={{ marginTop: "20px" }}
          >
            Back to Login
          </Button>
          <Button
            type="submit"
            style={{ marginTop: "20px" }}
            onClick={handleSendToken}
          >
            Send
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ResetPasswordRequestToken;