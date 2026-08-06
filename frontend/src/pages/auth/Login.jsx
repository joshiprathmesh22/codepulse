import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "../../css/Login.css";

import { login } from "../../services/authService";
import loginFeatures from "../../data/loginFeatures";

import AuthNavbar from "../../components/auth/AuthNavbar";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import DashboardMockup from "../../components/auth/DashboardMockup";
import FeatureCard from "../../components/auth/FeatureCard";
import OAuthButton from "../../components/auth/OAuthButton";
import Divider from "../../components/auth/Divider";
import ErrorAlert from "../../components/auth/ErrorAlert";
import InputField from "../../components/auth/InputField";
import PasswordField from "../../components/auth/PasswordField";

import MailIcon from "../../components/icons/MailIcon";
import LockIcon from "../../components/icons/LockIcon";
import ShieldIcon from "../../components/icons/ShieldIcon";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
  try {
    const data = await githubLogin();

    window.location.href = data.authorization_url;
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.detail ||
      "Please login first before connecting GitHub."
    );
  }
};

  return (
    <>
      <AuthNavbar type="login" />

      <AuthLayout
        left={
          <>
            <div className="lp-hero">
              <h1 className="lp-headline">
                Engineering intelligence
                <br />
                that{" "}
                <span className="lp-gradient-text">
                  drives impact
                </span>
              </h1>

              <p className="lp-subtext">
                Connect your GitHub.
                <br />
                Sync your repositories.
                <br />
                Unlock powerful engineering insights.
              </p>
            </div>

            <div className="lp-features">
              {loginFeatures.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              ))}
            </div>

            <DashboardMockup />
          </>
        }
        right={
          <>
            <AuthCard
              title="Welcome back 👋"
              subtitle="Login to your CodePulse account"
            >
              <OAuthButton onClick={handleGitHub} />

              <div className="lp-oauth-note">
                <LockIcon />
                <span>Secure OAuth authentication</span>
              </div>

              <Divider text="or" />

              <ErrorAlert message={error} />

              <form
                className="lp-form"
                onSubmit={handleSubmit}
              >
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  icon={<MailIcon />}
                />

                <PasswordField
                  label="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <div className="lp-form-row">
                  <label className="lp-checkbox-label">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) =>
                        setRemember(e.target.checked)
                      }
                    />
                    Remember me
                  </label>

                  <Link
                    to="/forgot-password"
                    className="lp-forgot"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className={`lp-submit-btn ${
                    loading
                      ? "lp-submit-btn--loading"
                      : ""
                  }`}
                  disabled={loading}
                >
                  {loading
                    ? "Signing in..."
                    : "Login"}
                </button>
              </form>

              <div className="lp-jwt-note">
                <ShieldIcon />
                <span>
                  Secured with JWT Authentication
                </span>
              </div>
            </AuthCard>

            <p className="lp-terms">
              By logging in you agree to our{" "}
              <Link
                to="/terms"
                className="lp-terms-link"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="lp-terms-link"
              >
                Privacy Policy
              </Link>
            </p>

            <p
              className="lp-terms"
              style={{ marginTop: 12 }}
            >
            </p>
          </>
        }
      />
    </>
  );
};

export default Login;