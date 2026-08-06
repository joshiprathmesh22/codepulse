import { useState } from "react";

import EyeIcon from "../icons/EyeIcon";
import EyeOffIcon from "../icons/EyeOffIcon";
import LockIcon from "../icons/LockIcon";
const PasswordField = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  icon,
}) => {

  const [show, setShow] = useState(false);

  return (

    <div className="lp-field">

      <label
        htmlFor={id}
        className="lp-label"
      >
        {label}
      </label>

      <div
        className={`lp-input-wrap ${
          error ? "rg-input-error" : ""
        }`}
      >

        {icon && (
          <span className="lp-input-icon">
            {icon}
          </span>
        )}

        <input
          id={id}
          className="lp-input lp-input--pw"
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />

        <button
          type="button"
          className="lp-eye-btn"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>

      </div>

      {error && (
        <p className="rg-field-error">
          {error}
        </p>
      )}

    </div>

  );
};

export default PasswordField;