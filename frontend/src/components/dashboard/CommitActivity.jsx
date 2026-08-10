const CommitActivity = ({ activity = [] }) => {
  const maxCount = Math.max(
    ...activity.map((item) => item.count),
    1
  );

  return (
    <div className="commit-activity-card">

      <div className="commit-activity-header">
        <div>
          <h2>Commit Activity</h2>
          <p>Commits across your organization</p>
        </div>

        <span className="commit-activity-period">
          Last 7 days
        </span>
      </div>

      <div className="commit-chart">

        {activity.map((item) => {

          const height =
            item.count === 0
              ? 4
              : Math.max(
                  (item.count / maxCount) * 160,
                  12
                );

          const date = new Date(
            item.date + "T00:00:00"
          );

          const day = date.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          );

          return (
            <div
              className="commit-chart-column"
              key={item.date}
            >

              <div className="commit-chart-value">
                {item.count}
              </div>

              <div className="commit-chart-bar-wrapper">

                <div
                  className="commit-chart-bar"
                  style={{
                    height: `${height}px`,
                  }}
                  title={`${item.count} commits`}
                />

              </div>

              <span className="commit-chart-day">
                {day}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default CommitActivity;