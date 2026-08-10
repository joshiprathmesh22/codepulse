const Topbar = () => {
  return (
    <header className="dashboard-topbar">

      <button className="sidebar-toggle">
        ☰
      </button>

      <div className="dashboard-search">

        <span>⌕</span>

        <input
          type="text"
          placeholder="Search repositories, users, issues..."
        />

        <span className="search-shortcut">
          ⌘ K
        </span>

      </div>

      <div className="dashboard-topbar-actions">

        <button className="add-repository-btn">
          + Add Repository
        </button>

        <button className="topbar-icon-btn">
          ♧
        </button>

        <button className="topbar-icon-btn">
          ?
        </button>

        <div className="profile-avatar">
          P
        </div>

      </div>

    </header>
  );
};

export default Topbar;