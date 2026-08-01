function Input({
  label,
  type = "text",
  placeholder,
}) {
  return (
    <div className="space-y-2">

      <label className="text-sm text-[#7A8FA8]">

        {label}

      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="
        w-full
        rounded-xl
        border
        border-[#2A3F60]
        bg-[#111B31]
        px-5
        py-4
        text-white
        outline-none
        transition
        focus:border-[#4F7EFF]
        focus:ring-4
        focus:ring-blue-500/20
        "
      />

    </div>
  );
}

export default Input;