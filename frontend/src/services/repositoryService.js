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

export const getRepositoryBranches = async (repositoryId) => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    `/repositories/${repositoryId}/branches/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getRepositoryPullRequests = async (repositoryId) => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    `/repositories/${repositoryId}/pull-requests/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getRepositoryIssues  = async (repositoryId) => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    `/repositories/${repositoryId}/issues/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
