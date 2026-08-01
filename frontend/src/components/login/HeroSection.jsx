function HeroSection() {
  return (
    <section className="relative hidden overflow-hidden border-r border-[#1E2D45] bg-[#060B18] lg:flex">

      <div className="mx-auto flex w-full max-w-2xl flex-col justify-between p-16">

        <div>

          <div className="mb-16 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">

              ⚡

            </div>

            <h1 className="text-3xl font-bold text-white">

              CodePulse

            </h1>

          </div>

          <h2 className="max-w-xl text-6xl font-extrabold leading-tight text-white">

            Engineering Intelligence

            <br />

            that{" "}

            <span className="text-[#4F7EFF]">

              drives impact

            </span>

          </h2>

          <p className="mt-8 max-w-lg text-lg leading-9 text-[#7A8FA8]">

            Connect GitHub.

            Sync repositories.

            Monitor engineering performance.

            Track commits, pull requests,

            issues and developer productivity.

          </p>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;