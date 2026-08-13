const PullRequestTrends = ({ activity = [] }) => {
  const maxValue = Math.max(
    ...activity.flatMap((item) => [
      item.opened,
      item.merged,
      item.closed,
    ]),
    1
  );

  const chartWidth = 700;
  const chartHeight = 230;

  const getX = (index) => {
    if (activity.length <= 1) return 0;

    return (
      (index / (activity.length - 1)) *
      chartWidth
    );
  };

  const getY = (value) => {
    return (
      chartHeight -
      (value / maxValue) * chartHeight
    );
  };

  const createPath = (key) => {
    return activity
      .map((item, index) => {
        const x = getX(index);
        const y = getY(item[key]);

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const formatDay = (date) => {
    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );
  };

  const totalOpened = activity.reduce(
    (sum, item) => sum + item.opened,
    0
  );

  const firstDate = activity[0]?.date;
  const lastDate =
    activity[activity.length - 1]?.date;

  return (
    <div className="pull-request-card">

      <div className="pull-request-header">

        <div>
          <h2>Pull Request Trends</h2>

          <div className="pull-request-summary">

            <span className="pull-request-total">
              {totalOpened}
            </span>

            <span className="pull-request-period">
              This Week
            </span>

          </div>
        </div>

        <select className="pull-request-select">
          <option>This Week</option>
        </select>

      </div>

      <div className="pull-request-legend">

        <span>
          <i className="legend-dot opened-dot" />
          Opened
        </span>

        <span>
          <i className="legend-line merged-line" />
          Merged
        </span>

        <span>
          <i className="legend-line closed-line" />
          Closed
        </span>

      </div>

      <div className="pull-request-chart">

        {activity.length > 0 ? (
          <svg
            viewBox={`0 0 ${chartWidth} ${
              chartHeight + 45
            }`}
            preserveAspectRatio="none"
          >

            {/* Grid lines */}

            {[0, 1, 2, 3].map((line) => {

              const y =
                (chartHeight / 3) *
                line;

              return (
                <line
                  key={line}
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  className="chart-grid-line"
                />
              );

            })}

            {/* Opened */}

            <path
              d={createPath("opened")}
              className="pr-line pr-opened"
              fill="none"
            />

            {/* Merged */}

            <path
              d={createPath("merged")}
              className="pr-line pr-merged"
              fill="none"
            />

            {/* Closed */}

            <path
              d={createPath("closed")}
              className="pr-line pr-closed"
              fill="none"
            />

            {/* X axis labels */}

            {activity.map((item, index) => {

              const x = getX(index);

              return (
                <text
                  key={item.date}
                  x={x}
                  y={chartHeight + 30}
                  className="chart-day-label"
                  textAnchor="middle"
                >
                  {formatDay(item.date)}
                </text>
              );

            })}

          </svg>
        ) : (
          <div className="chart-empty">
            No pull request activity yet.
          </div>
        )}

      </div>

      {firstDate && lastDate && (
        <div className="pull-request-date-range">
          {firstDate} — {lastDate}
        </div>
      )}

    </div>
  );
};

export default PullRequestTrends;