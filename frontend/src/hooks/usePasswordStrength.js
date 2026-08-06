const usePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "",
    };
  }

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "", color: "" },
    { label: "Weak", color: "#FF4D6A" },
    { label: "Fair", color: "#F5A623" },
    { label: "Good", color: "#38C6F5" },
    { label: "Strong", color: "#10D98D" },
  ];

  return {
    score,
    ...levels[score],
  };
};

export default usePasswordStrength;