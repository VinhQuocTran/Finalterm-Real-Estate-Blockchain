import { useState } from "react";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./signup.scss";

const Signup = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState(null);

  return (
    <div className="signup">
      <ContentWrapper>
        <div className="authForm">
          <h1>Get Started</h1>
          <span>Lofty is the easiest way to invest in real estate</span>
          <div className="formInput">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="formInput">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="formInput">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input id="passwordConfirm" type="password" onChange={(e) => setPasswordConfirm(e.target.value)} />
          </div>
          <button className={(!email || !password || !passwordConfirm) ? "disabled" : ""} type="button">Continue</button>
          <p>Already have an account? <a href="/sign-in">Sign in</a></p>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default Signup