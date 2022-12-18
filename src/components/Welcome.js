import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import "./welcome.css";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const toastOptions = {
    position: "top-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/homepage");
      }
    });
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/homepage");
        toast.success("SignIn Succesfull.. Welcome", toastOptions);
      })
      .catch((err) => toast.error(err.message, toastOptions));
  };

  const handleRegister = () => {
    if (registerInformation.email !== registerInformation.confirmEmail) {
      toast.error("Please confirm that email are the same.", toastOptions);
      return;
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      toast.error("Please confirm that password are the same", toastOptions);
      return;
    }
    createUserWithEmailAndPassword(
      auth,
      registerInformation.email,
      registerInformation.password
    )
      .then(() => {
        navigate("/homepage");
        toast.success("Registration Succesfull.. Welcome", toastOptions);
      })
      .catch((err) => toast.error(err.message, toastOptions));
  };

  return (
    <div className="welcome">
      <div className="login-register-container">
        {isRegistering ? (
          <>
            <EventNoteOutlinedIcon fontSize="large" />
            <h1>Todo-List</h1>
            <input
              type="email"
              placeholder="Email"
              value={registerInformation.email}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  email: e.target.value,
                })
              }
            />
            <input
              type="email"
              placeholder="Confirm Email"
              value={registerInformation.confirmEmail}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmEmail: e.target.value,
                })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={registerInformation.password}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  password: e.target.value,
                })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={registerInformation.confirmPassword}
              onChange={(e) =>
                setRegisterInformation({
                  ...registerInformation,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button
              className="sign-in-register-button"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              className="create-account-button"
              onClick={() => setIsRegistering(false)}
            >
              Go back
            </button>
          </>
        ) : (
          <>
            <EventNoteOutlinedIcon fontSize="large" />
            <h1>Todo-List</h1>
            <input
              type="email"
              placeholder="Email"
              onChange={handleEmailChange}
              value={email}
            />
            <input
              type="password"
              onChange={handlePasswordChange}
              value={password}
              placeholder="Password"
            />
            <button className="sign-in-register-button" onClick={handleSignIn}>
              Sign In
            </button>
            <button
              className="create-account-button"
              onClick={() => setIsRegistering(true)}
            >
              <h3>
                <b>Create an account</b>
              </h3>
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
