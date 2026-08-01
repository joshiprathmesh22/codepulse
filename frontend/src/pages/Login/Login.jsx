import HeroSection from "../../components/login/HeroSection";
import LoginCard from "../../components/login/LoginCard";

function Login() {
  return (
    <main className="min-h-screen bg-[#060B18]">
      <div className="grid min-h-screen lg:grid-cols-2">

        <HeroSection />

        <LoginCard />

      </div>
    </main>
  );
}

export default Login;