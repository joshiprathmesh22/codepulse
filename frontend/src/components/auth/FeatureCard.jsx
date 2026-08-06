const FeatureCard = ({
  Icon,
  title,
  desc,
  color,
  bg,
}) => {
  return (
    <div className="lp-feature-card">
      <div
        className="lp-feature-icon"
        style={{
          background: bg,
          color,
        }}
      >
        <Icon />
      </div>

      <div className="lp-feature-text">
        <p className="lp-feature-title">
          {title}
        </p>

        <p className="lp-feature-desc">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;