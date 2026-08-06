import CheckIcon from "../icons/CheckIcon";

const TermsCheckbox = ({
  checked,
  onChange,
  error,
}) => {
  return (
    <div
      className={`rg-terms-row ${
        error ? "rg-terms-row--error" : ""
      }`}
    >
      <label className="rg-terms-label">

        <div
          className={`rg-custom-checkbox ${
            checked
              ? "rg-custom-checkbox--checked"
              : ""
          }`}
          role="checkbox"
          aria-checked={checked}
          tabIndex={0}
          onClick={onChange}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              onChange();
            }
          }}
        >
          {checked && <CheckIcon />}
        </div>

        <span>
          I agree to the{" "}
          <a href="/terms" className="lp-terms-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="lp-terms-link">
            Privacy Policy
          </a>
        </span>

      </label>

      {error && (
        <p className="rg-field-error rg-field-error--inline">
          {error}
        </p>
      )}
    </div>
  );
};

export default TermsCheckbox;