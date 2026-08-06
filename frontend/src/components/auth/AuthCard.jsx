const AuthCard = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <div className={`lp-card ${className}`}>

      {title && (
        <h2 className="lp-card-title">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="lp-card-sub">
          {subtitle}
        </p>
      )}

      {children}

    </div>
  );
};

export default AuthCard;