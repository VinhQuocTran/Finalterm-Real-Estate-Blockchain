import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { AuthFormInput } from "../../components/imports";
import { BASE_URL } from "../../utils/api";
import "./signin.scss";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      label: "Email",
      errorMessage: "Your email is invalid.",
      required: true
    },
    {
      id: 2,
      name: "password",
      type: "password",
      label: "Password",
      errorMessage: "Password must not be empty.",
      required: true
    }
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    try {
      const response = await axios.post(BASE_URL + "/accounts/signin", Object.fromEntries(data));
      if (response.data.status === "success") {
      } else {
        toast.warn('Internal Server Error!', {
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
    } catch (err) {
      toast.warn('Internal Server Error!', {
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
          <h1>Sign In</h1>
          <span>Invest in new properties and manage your current investments</span>
          {inputs.map((item) => <AuthFormInput key={item.id} {...item} value={values[item.name]} onChange={onChange} />)}
          <button type="submit">Continue</button>
          <p>Don&#8217;t have an account? <a href="/sign-up">Sign up for free</a></p>
          <p>Forgot password? <a href="/forgot-password">Click here</a></p>
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
  )
}

export default Signin