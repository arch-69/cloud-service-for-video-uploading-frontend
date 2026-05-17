import httpClient from "./httpClient";

export const getSubscriptionIdApi = async (planId) => {
  const response = await httpClient.post("/v1/razorpay/get-subscription-id", { planId });
  return response.data?.data;
};
