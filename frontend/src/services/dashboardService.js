import api from "../api/axios";

export const getDashboardOverview = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    "/dashboard/overview/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


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