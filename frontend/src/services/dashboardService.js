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

export const getAnalytics = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    "/dashboard/analytics/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAlerts = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    "/dashboard/alerts/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getOrganization = async () => {
  const token = localStorage.getItem("access");

  const response = await api.get(
    "/dashboard/organization/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};