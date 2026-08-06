import usePasswordStrength from "../../hooks/usePasswordStrength";

const PasswordStrength = ({ password }) => {
  const strength = usePasswordStrength(password);

  if (!strength.label) return null;

  return (
    <div className="rg-strength">
      <div className="rg-strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rg-strength-bar"
            style={{
              background:
                i <= strength.score
                  ? strength.color
                  : "#1E2D45",
            }}
          />
        ))}
      </div>

      <span
        className="rg-strength-label"
        style={{
          color: strength.color,
        }}
      >
        {strength.label}
      </span>
    </div>
  );
};

export default PasswordStrength;