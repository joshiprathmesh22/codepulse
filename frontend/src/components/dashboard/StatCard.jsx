const StatCard = ({
  title,
  value,
  change,
  description,
}) => {
  return (
    <div className="dashboard-stat-card">

      <div className="stat-card-header">
        <span>
          {title}
        </span>
      </div>

      <div className="stat-card-value">
        {value}
      </div>

      {change && (
        <div className="stat-card-change">
          ↑ {change}
        </div>
      )}

      {description && (
        <div className="stat-card-description">
          {description}
        </div>
      )}

    </div>
  );
};

export default StatCard;