import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import Divider from "../ui/Divider";
import Input from "../ui/Input";

function LoginCard() {
  return (
    <section className="flex items-center justify-center bg-[#091226] p-10">

      <div
        className="w-full max-w-lg rounded-3xl border border-[#1E2D45] p-10"
        style={{
          background:
            "linear-gradient(180deg,#121C31,#0E1628)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,.40)",
        }}
      >
        <h2 className="text-center text-4xl font-bold text-white">
          Welcome back 👋
        </h2>

        <p className="mt-4 text-center text-[#7A8FA8]">
          Login to your CodePulse account
        </p>

        <div className="mt-8">
          <Button variant="github">
            Continue with GitHub
          </Button>
        </div>

        <div className="my-8">
          <Divider />
        </div>

        <div className="space-y-5">
          <Input
            label="Email address"
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Checkbox />

          <button className="text-sm text-[#4F7EFF] hover:underline">
            Forgot password?
          </button>
        </div>

        <div className="mt-8">
          <Button>
            Login
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-[#7A8FA8]">
          🔒 Secured with JWT Authentication
        </p>
      </div>

    </section>
  );
}

export default LoginCard;