import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { AuthFormInput } from "../../components/imports";

import "react-toastify/dist/ReactToastify.css";
import "./signup.scss";

const Signup = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      label: "Your name",
      placeholder: "Leo Messi",
      errorMessage: "Your name must be 5-15 characters and should not include any special character.",
      pattern: "^[A-Z a-z]{5,15}$",
      required: true
    },
    {
      id: 2,
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "abc@gmail.com",
      errorMessage: "Your email is invalid.",
      required: true
    },
    {
      id: 3,
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Your password",
      errorMessage: "Your password should be 8-20 characters and include at least 1 number, 1 character and 1 special character.",
      pattern: "^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}$",
      required: true
    },
    {
      id: 4,
      name: "passwordConfirm",
      type: "password",
      label: "Confirm password",
      placeholder: "Confirm your password",
      errorMessage: "Confirm password do not match.",
      pattern: values.password,
      required: true
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(Object.fromEntries(data));
  };

  return (
    <div className="signup">
      <ContentWrapper>
        <form className="authForm" onSubmit={handleSubmit}>
          <h1>Get Started</h1>
          <span>Lofty is the easiest way to invest in real estate</span>
          {inputs.map((item) => (
            <AuthFormInput
              key={item.id}
              {...item}
              value={values[item.name]}
              onChange={onChange}
            />
          ))}
          <button type="submit">
            Continue
          </button>
          <p>
            Already have an account? <a href="/sign-in">Sign in</a>
          </p>
        </form>
      </ContentWrapper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Signup;
