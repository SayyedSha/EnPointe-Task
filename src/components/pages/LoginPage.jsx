import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

export default function Login() {
  const Email = useRef(null);
  const Password = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8001/api/user/login",
        {
          email: Email.current.value,
          password: Password.current.value
        },
        {
          headers: { apikey: "hiGGsboSon", secretkey: "kepLer32c" }
        }
      );

      if (response.data.user) {
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      } else {
        setErrorMessage(response.data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Sign in to your account</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              ref={Email}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              ref={Password}
              required
              className="input"
            />
          </div>
          <button type="submit" className="button">Sign in</button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
}
