import { connectGitHub } from "../../services/githubServices";
// import { register } from "../../services/authService";

function Dashboard() {

  const handleConnectGitHub = async () => {
    try {
      const data = await connectGitHub();

      console.log("GitHub Login Response:", data);

      window.location.href = data.authorization_url;

    } catch (err) {
      console.error("GitHub Connection Error:", err);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <button
        onClick={handleConnectGitHub}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          cursor: "pointer",
        }}
      >
        Connect GitHub
      </button>
    </div>
  );
}

export default Dashboard;