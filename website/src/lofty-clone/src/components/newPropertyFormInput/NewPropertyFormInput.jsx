import { useState } from "react";
import "./newPropertyFormInput.scss";

const NewPropertyFormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { id, label, errorMessage, onChange, ...inputProps } = props;

  const handleFocus = () => {
    setFocused(true);
  };

  return (
    <div className="inputForm">
      <label htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}        
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default NewPropertyFormInput;
