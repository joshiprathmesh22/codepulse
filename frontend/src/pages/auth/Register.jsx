import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../css/Login.css";
import "../../css/Register.css";

import { register } from "../../services/authService";
import registerBenefits from "../../data/registerBenefits";

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
import PasswordStrength from "../../components/auth/PasswordStrength";
import TermsCheckbox from "../../components/auth/TermsCheckbox";
// Icons
import UserIcon from "../../components/icons/UserIcon";
import BuildingIcon from "../../components/icons/BuildingIcon";
import MailIcon from "../../components/icons/MailIcon";
import LockIcon from "../../components/icons/LockIcon";
import ShieldIcon from "../../components/icons/ShieldIcon";

import usePasswordStrength from "../../hooks/usePasswordStrength";
const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    orgName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const validate = () => {
    const errs = {};

    if (!form.name.trim())
      errs.name = "Full name is required.";

    if (!form.orgName.trim())
      errs.orgName = "Organization name is required.";

    if (!form.email.trim())
      errs.email = "Email is required.";

    if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters.";

    if (form.password !== form.confirm)
      errs.confirm = "Passwords do not match.";

    if (!agreed)
      errs.agreed = "Please accept Terms & Conditions.";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const data = await register({
        organization_name: form.orgName,
        full_name: form.name,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);

      navigate("/dashboard");
    } catch (err) {
      const res = err.response?.data;

      if (res?.email)
        setErrors({ email: res.email[0] });
      else if (res?.password)
        setErrors({ password: res.password[0] });
      else if (res?.organization_name)
        setErrors({ orgName: res.organization_name[0] });
      else if (res?.full_name)
        setErrors({ name: res.full_name[0] });
      else
        setErrors({
          global: res?.detail || "Registration failed.",
        });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = () => {
    window.location.href =
      "http://127.0.0.1:8000/api/github/login/";
  };

  return (
    <>
      <AuthNavbar type="register" />

      <AuthLayout
        left={
          <>
            <div className="lp-hero">
              <h1 className="lp-headline">
                Ship better code
                <br />
                <span className="lp-gradient-text">
                  starting today
                </span>
              </h1>

              <p className="lp-subtext">
                Join thousands of developers using
                CodePulse to improve engineering
                productivity.
              </p>
            </div>

            <div className="lp-features">
              {registerBenefits.map((feature) => (
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
          <AuthCard
            title="Create Account"
            subtitle="Start using CodePulse today"
          >
            <OAuthButton onClick={handleGitHub} />

            <Divider text="or" />

            <ErrorAlert message={errors.global} />

            <form
              className="lp-form"
              onSubmit={handleSubmit}
            >
              <InputField
                id="name"
                label="Full Name"
                icon={<UserIcon />}
                value={form.name}
                onChange={set("name")}
                placeholder="John Doe"
                autoComplete="name"
                error={errors.name}
              />

              <InputField
                id="organization"
                label="Organization"
                icon={<BuildingIcon />}
                value={form.orgName}
                onChange={set("orgName")}
                placeholder="Acme Inc."
                autoComplete="organization"
                error={errors.orgName}
              />

              <InputField
                id="email"
                type="email"
                label="Email"
                icon={<MailIcon />}
                value={form.email}
                onChange={set("email")}
                placeholder="john@example.com"
                autoComplete="email"
                error={errors.email}
              />

              <PasswordField
                id="password"
                label="Password"
                icon={<LockIcon />}
                value={form.password}
                onChange={set("password")}
                placeholder="Enter password"
                autoComplete="new-password"
                error={errors.password}
              />

              <PasswordStrength
                password={form.password}
              />

              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                icon={<LockIcon />}
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="Confirm password"
                autoComplete="new-password"
                error={errors.confirm}
              />

              <TermsCheckbox
                checked={agreed}
                onChange={() =>
                  setAgreed(!agreed)
                }
                error={errors.agreed}
              />

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
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            <div className="lp-jwt-note">
              <ShieldIcon size={14} />
              <span>
                Secured with JWT Authentication
              </span>
            </div>
          </AuthCard>
        }
      />
    </>
  );
};

export default Register;