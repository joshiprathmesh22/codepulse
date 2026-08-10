const DashboardLayout = ({
  sidebar,
  topbar,
  children,
}) => {
  return (
    <div className="dashboard-layout">

      {sidebar}

      <div className="dashboard-main">

        {topbar}

        <main className="dashboard-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;