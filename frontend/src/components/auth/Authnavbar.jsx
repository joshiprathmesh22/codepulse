import { Link } from "react-router-dom";
import PulseIcon from "../icons/PulseIcon";

const AuthNavbar = ({ type = "login" }) => {
  const isLogin = type === "login";

  return (
    <nav className="lp-nav">
      <Link to="/" className="lp-logo">
        <PulseIcon />
        <span className="lp-logo-text">CodePulse</span>
      </Link>

      <div className="lp-nav-right">
        {isLogin ? (
          <>
            <span className="lp-nav-hint">
              Don't have an account?
            </span>

            <Link to="/register" className="lp-nav-link">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <span className="lp-nav-hint">
              Already have an account?
            </span>

            <Link to="/" className="lp-nav-link">
              Log in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default AuthNavbar;