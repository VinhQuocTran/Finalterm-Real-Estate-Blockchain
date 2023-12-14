import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { AuthFormInput } from "../../components/imports";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";
import "react-toastify/dist/ReactToastify.css";
import "./signup.scss";

const Signup = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    address: "",
    phoneNumber: "",
    residentId: "",
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
      name: "address",
      type: "text",
      label: "Address",
      placeholder: "61 Main Street, California",
      errorMessage: "Address should not be empty",
      required: true
    },
    {
      id: 4,
      name: "phoneNumber",
      type: "phone",
      label: "Phone number",
      placeholder: "0123456789",
      errorMessage: "Phone number should not be empty",
      required: true
    },
    {
      id: 5,
      name: "residentId",
      type: "text",
      label: "Resident ID",
      placeholder: "0087462839",
      errorMessage: "Resident ID should not be empty",
      required: true
    },
    {
      id: 6,
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Your password",
      errorMessage: "Your password should be 8-20 characters and include at least 1 number, 1 character and 1 special character.",
      pattern: "^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}$",
      required: true
    },
    {
      id: 7,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginStart());
    setIsLoading(true);
    try {
      const data = new FormData(e.target);
      await axios.post(BASE_URL + "/accounts/signup", Object.fromEntries(data));
      dispatch(loginSuccess(response.data));
      setIsLoading(false);
      toast.success('Sign up successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      dispatch(loginFailure());
      toast.error('Internal Server Error!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
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
          <button type="submit" disabled={isLoading}>Continue</button>
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
