function Checkbox() {
  return (
    <label className="flex items-center gap-3">

      <input
        type="checkbox"
        className="
        h-4
        w-4
        rounded
        accent-[#4F7EFF]
        "
      />

      <span className="text-sm text-[#7A8FA8]">

        Remember me

      </span>

    </label>
  );
}

export default Checkbox;