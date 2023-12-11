import { useState } from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./signin.scss";

const Signin = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);


  return (
    <div className="signup">
      <ContentWrapper>
        <div className="authForm">
          <h1>Sign In</h1>
          <span>Invest in new properties and manage your current investments</span>
          <div className="formInput">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="formInput">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          </div>          
          <button className={(!email || !password) ? "disabled" : ""  } type="button">Continue</button>
          <p>Don&#8217;t have an account? <a href="/sign-up">Sign up for free</a></p>
          <p>Forgot password? <a href="/forgot-password">Click here</a></p>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default Signin