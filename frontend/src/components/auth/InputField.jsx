const InputField = ({
  label,
  id,
  type = "text",
  icon,
  placeholder,
  value,
  onChange,
  autoComplete,
  error,
}) => {
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
          className="lp-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />

      </div>

      {error && (
        <p className="rg-field-error">
          {error}
        </p>
      )}

    </div>
  );
};

export default InputField;