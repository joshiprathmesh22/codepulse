import api from "../api/axios.js";
export const connectGitHub = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get("/github/login/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const syncRepositories = async () => {
  const token = localStorage.getItem("access");

  const response = await api.post(
    "/github/sync/",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};