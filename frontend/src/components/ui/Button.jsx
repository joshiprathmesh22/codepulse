function Button({
  children,
  variant = "primary",
}) {
  if (variant === "github") {
    return (
      <button
        className="
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-[#2A3F60]
          bg-[#1A2540]
          py-4
          font-semibold
          text-white
          transition-all
          duration-300
          hover:border-[#4F7EFF]
          hover:bg-[#243250]
        "
      >
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub"
          className="h-5 w-5"
        />

        {children}
      </button>
    );
  }

  return (
    <button
      className="
        w-full
        rounded-xl
        bg-gradient-to-r
        from-[#4F7EFF]
        to-[#5D87FF]
        py-4
        font-semibold
        text-white
        shadow-[0_15px_40px_rgba(79,126,255,.35)]
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {children}
    </button>
  );
}

export default Button;