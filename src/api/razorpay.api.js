import httpClient from "./httpClient";

export const getSubscriptionIdApi = async (planId) => {
  const response = await httpClient.post("/v1/razorpay/get-subscription-id", { planId });
  return response.data?.data;
};

export const getCurrentPlanApi = async () => {
  const response = await httpClient.get("/v1/razorpay/get-current-plan");
  return response.data;
};
