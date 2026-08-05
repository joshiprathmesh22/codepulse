import { useState } from "react";
import "../../css/Register.css";
import { register } from "../../services/authService";



// ── Inline SVG Icons ─────────────────────────────────────────────────────────

const PulseIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M2 13h4l3-9 5 18 3-11 2 4h5" stroke="#4F7EFF" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GitHubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
      0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
      -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
      .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
      -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115
      2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028
      2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0
      .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 7l-10 7L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94
      M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0
      11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const TeamIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const SecureIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

// ── Feature Data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    Icon: GitHubIcon,
    title: 'GitHub Integration',
    desc: 'Secure OAuth connection with real-time data synchronization.',
    color: '#4F7EFF',
    bg: 'rgba(79,126,255,0.12)',
  },
  {
    Icon: AnalyticsIcon,
    title: 'Smart Analytics',
    desc: 'Track commits, PRs, issues, and developer productivity.',
    color: '#A78BFF',
    bg: 'rgba(167,139,255,0.12)',
  },
  {
    Icon: TeamIcon,
    title: 'Team Insights',
    desc: "Understand your team's performance and collaboration metrics.",
    color: '#10D98D',
    bg: 'rgba(16,217,141,0.12)',
  },
  {
    Icon: SecureIcon,
    title: 'Secure & Private',
    desc: 'Enterprise-grade security with JWT authentication.',
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.12)',
  },
];

// ── Dashboard Mockup ──────────────────────────────────────────────────────────

const DashboardMockup = () => (
  <div className="lp-mockup-wrapper">
    <div className="lp-mockup-device">
      <div className="lp-mockup-screen">
        {/* Topbar */}
        <div className="lp-mockup-topbar">
          <div className="lp-mockup-dots">
            <span /><span /><span />
          </div>
          <div className="lp-mockup-search" />
        </div>
        {/* Body */}
        <div className="lp-mockup-body">
          {/* Sidebar */}
          <div className="lp-mockup-sidebar">
            <div className="lp-mockup-nav active" />
            <div className="lp-mockup-nav" />
            <div className="lp-mockup-nav" />
            <div className="lp-mockup-nav" />
          </div>
          {/* Content */}
          <div className="lp-mockup-content">
            {/* KPI cards */}
            <div className="lp-mockup-cards">
              {['#4F7EFF','#10D98D','#F5A623'].map(c => (
                <div key={c} className="lp-mockup-kpi" style={{ borderTopColor: c }} />
              ))}
            </div>
            {/* Area chart */}
            <div className="lp-mockup-chart">
              <svg width="100%" height="56" viewBox="0 0 260 56" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mcg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F7EFF" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#4F7EFF" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path
                  d="M0,48 L30,42 L55,46 L80,33 L105,37 L130,22 L155,27 L180,14 L205,18 L230,8 L260,11 L260,56 L0,56 Z"
                  fill="url(#mcg)"
                />
                <path
                  d="M0,48 L30,42 L55,46 L80,33 L105,37 L130,22 L155,27 L180,14 L205,18 L230,8 L260,11"
                  fill="none" stroke="#4F7EFF" strokeWidth="1.5"
                />
                {/* Purple line */}
                <path
                  d="M0,52 L30,48 L55,50 L80,44 L105,46 L130,40 L155,42 L180,36 L205,38 L230,32 L260,30"
                  fill="none" stroke="#A78BFF" strokeWidth="1.2" strokeDasharray="3,3"
                />
              </svg>
            </div>
            {/* Bar chart */}
            <div className="lp-mockup-bars">
              {[35,58,42,75,50,68,32,80,45,62].map((h, i) => (
                <div
                  key={i}
                  className="lp-mockup-bar"
                  style={{
                    height: `${h}%`,
                    background: i === 7
                      ? 'linear-gradient(to top,#4F7EFF,#A78BFF)'
                      : 'rgba(79,126,255,0.35)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Glow under device */}
    <div className="lp-mockup-glow" />
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const Register = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        organization_name: organizationName,
        full_name: fullName,
        email,
        password,
      });

      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);

      // Redirect to dashboard
      window.location.href = "/dashboard";

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = () => {
    window.location.href =
      "http://127.0.0.1:8000/api/github/login/";
  };

  return (
    <div className="lp-root">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <a href="/" className="lp-logo">
          <PulseIcon />
          <span className="lp-logo-text">CodePulse</span>
        </a>
        <div className="lp-nav-right">
          <span className="lp-nav-hint">Don't have an account?</span>
          <a href="/register" className="lp-nav-link">Sign up</a>
        </div>
      </nav>

      {/* ── Split Body ──────────────────────────────────────── */}
      <div className="lp-body">

        {/* LEFT PANEL */}
        <div className="lp-left">
          <div className="lp-hero">
            <h1 className="lp-headline">
              Engineering intelligence<br />
              that <span className="lp-gradient-text">drives impact</span>
            </h1>
            <p className="lp-subtext">
              Connect your GitHub. Sync your data.<br />
              Unlock powerful insights across your engineering<br />
              workflow and developer productivity.
            </p>
          </div>

          <div className="lp-features">
            {FEATURES.map(({ Icon, title, desc, color, bg }) => (
              <div className="lp-feature-card" key={title}>
                <div className="lp-feature-icon" style={{ background: bg, color }}>
                  <Icon size={20} />
                </div>
                <div className="lp-feature-text">
                  <p className="lp-feature-title">{title}</p>
                  <p className="lp-feature-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <DashboardMockup />
        </div>

        {/* RIGHT PANEL */}
        <div className="lp-right">
          <div className="lp-card">

            <h2 className="lp-card-title">Welcome back 👋</h2>
            <p className="lp-card-sub">
              Login to your{' '}
              <span className="lp-accent-text">CodePulse</span> account
            </p>

            {/* GitHub OAuth */}
            <button className="lp-github-btn" onClick={handleGitHub} type="button">
              <GitHubIcon size={20} />
              Continue with GitHub
            </button>
            <div className="lp-oauth-note">
              <LockIcon />
              <span>Secure OAuth authentication</span>
            </div>

            {/* Divider */}
            <div className="lp-divider"><span>or</span></div>

            {/* Error */}
            {error && <div className="lp-error">{error}</div>}

            {/* Form */}
            <form className="lp-form" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="cp-email">Email address</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon"><MailIcon /></span>
                  <input
                    id="cp-email"
                    className="lp-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="cp-pw">Password</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon"><LockIcon /></span>
                  <input
                    id="cp-pw"
                    className="lp-input lp-input--pw"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="lp-eye-btn"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="lp-form-row">
                <label className="lp-checkbox-label">
                  <input
                    type="checkbox"
                    className="lp-checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="lp-forgot">Forgot password?</a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`lp-submit-btn${loading ? ' lp-submit-btn--loading' : ''}`}
                disabled={loading}
              >
                {loading
                  ? <><span className="lp-spinner" />Signing in...</>
                  : 'Login'}
              </button>

            </form>

            <div className="lp-jwt-note">
              <ShieldIcon />
              <span>Secured with JWT authentication</span>
            </div>
          </div>

          <p className="lp-terms">
            By logging in, you agree to our{' '}
            <a href="/terms" className="lp-terms-link">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="lp-terms-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;