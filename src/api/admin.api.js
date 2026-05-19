import httpClient from "./httpClient";

export const getServiceTypesApi = async () => {
  const response = await httpClient.get("/v1/admin/blocked-services-types");
  return response.data;
};

export const getBlockedServicesApi = async () => {
  const response = await httpClient.get("/v1/admin/blocked-service");
  return response.data;
};

export const getAllServicesApi = async () => {
  const response = await httpClient.get("/v1/admin/allservices");
  return response.data;
};

export const blockServiceApi = async (serviceId, block) => {
  const response = await httpClient.put(`/v1/admin/updateservice/${serviceId}`,
    { isBlocked: !!block, block: !!block }
  );
  return response.data;
};
