import GitHubIcon from "../icons/GitHubIcon";

const OAuthButton = ({
  text = "Continue with GitHub",
  onClick,
}) => {
  return (
    <button
      type="button"
      className="lp-github-btn"
      onClick={onClick}
    >
      <GitHubIcon size={20} />
      {text}
    </button>
  );
};

export default OAuthButton;