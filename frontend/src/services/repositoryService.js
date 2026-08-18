import api from "../api/axios.js";

export const getRepositories = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    "/repositories/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRepository = async (repositoryId) => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    `/repositories/${repositoryId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRepositoryDashboard = async (
  repositoryId
) => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    `/repositories/${repositoryId}/dashboard/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRepositoryCommits = async (repositoryId) => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    `/repositories/${repositoryId}/commits/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};