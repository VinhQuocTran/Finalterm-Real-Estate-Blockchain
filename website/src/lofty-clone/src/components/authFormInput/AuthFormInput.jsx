import { useState } from "react";
import "./authFormInput.scss";

const AuthFormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { id, label, errorMessage, onChange, ...inputProps } = props;

  const handleFocus = () => {
    setFocused(true);
  };

  return (
    <div className="formInput">
      <label htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() => inputProps.name === 'passwordConfirm' && setFocused(true)}
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default AuthFormInput;
