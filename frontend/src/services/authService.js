
import api from "../api/axios.js";
export const login = async (email, password) => {
  const response = await api.post("/auth/login/", {
    email,
    password,
  });

  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/auth/register/", data);

  return response.data;
};

// GitHub OAuth
export const githubLogin = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get("/github/login/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};