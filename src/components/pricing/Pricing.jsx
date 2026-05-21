import { useEffect, useState } from "react";

import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Loader2,
} from "lucide-react";

import httpClient from "../../api/httpClient";

import { getSubscriptionIdApi } from "../../api/razorpay.api";

function formatPrice(price, period) {
  if (price === 0) return "Free";

  if (period === "yearly") {
    const yearly = price * 12 * 0.9;

    return `₹${yearly.toFixed(0)}/yr`;
  }

  return `₹${price}/mo`;
}

export default function Pricing({
  currentPlan,
  planLoading,
  planError,
  onRefreshCurrentPlan,
}) {
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState(null);

  const [period, setPeriod] =
    useState("monthly");

  const [payingPlanId, setPayingPlanId] =
    useState(null);

  const [paymentError, setPaymentError] =
    useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      try {
        const res = await httpClient.get(
          "/v1/public/get-plans"
        );

        if (!mounted) return;

        if (res?.data?.success) {
          setPlans(res.data.data || []);
        } else {
          setError(
            res?.data?.message ||
              "Failed to fetch plans"
          );
        }
      } catch (err) {
        if (!mounted) return;

        setError(
          err?.message ||
            "Failed to fetch plans"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const defaultFeatures = (planName) => {
    if (!planName) return [];

    if (
      planName.toLowerCase() === "free"
    ) {
      return [
        "1 GB total storage",
        "10 GB monthly bandwidth",
        "Max file size 100 MB",
        "Basic email support",
      ];
    }

    return [
      "10 GB total storage",
      "20 GB monthly bandwidth",
      "Max file size 1 GB",
      "Priority support",
      "Faster uploads & resume",
    ];
  };

  const loadRazorpay = () =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        return reject(
          new Error("No window")
        );
      }

      if (window.Razorpay) {
        return resolve(true);
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () =>
        reject(
          new Error(
            "Failed to load Razorpay SDK"
          )
        );

      document.body.appendChild(script);
    });

  const handleBuy = async (plan) => {
    setPaymentError(null);

    setPayingPlanId(plan._id);

    const isSubscribed =
      currentPlan?.status === "ACTIVE" ||
      currentPlan?.status ===
        "TRIALING";

    if (isSubscribed) {
      setPaymentError(
        "You already have an active subscription."
      );

      setPayingPlanId(null);

      return;
    }

    try {
      const key = (
        import.meta.env
          ?.VITE_RAZORPAY_KEY || ""
      ).trim();

      if (!key) {
        throw new Error(
          "Razorpay key is missing"
        );
      }

      const subscriptionId =
        await getSubscriptionIdApi(
          plan._id
        );

      if (!subscriptionId) {
        throw new Error(
          "No subscription id returned"
        );
      }

      await loadRazorpay();

      const options = {
        key,
        name: "CloudDock",
        description: `${plan.name} plan subscription`,
        subscription_id: subscriptionId,
        image: "/favicon.svg",

        notes: {
          planId: plan._id,
          period,
        },

        theme: {
          color: "#4f46e5",
        },

        handler: function () {
          window.history.pushState(
            {},
            "",
            "/billing/success"
          );

          window.dispatchEvent(
            new PopStateEvent(
              "popstate"
            )
          );
        },

        modal: {
          ondismiss: () => {
            setPayingPlanId(null);
          },
        },
      };

      const rzp =
        new window.Razorpay(options);

      rzp.open();
    } catch (err) {
      if (
        err?.response?.status === 409
      ) {
        setPaymentError(
          "You already have an active subscription."
        );

        onRefreshCurrentPlan?.();
      } else {
        setPaymentError(
          err?.message ||
            "Payment initialization failed"
        );
      }
    } finally {
      setPayingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#060B16]/95 p-6 text-[11px] text-white/50 backdrop-blur-2xl">
        Loading plans...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.04] p-6 text-[11px] text-red-200 backdrop-blur-2xl">
        Error loading plans: {error}
      </div>
    );
  }

  const isSubscribed =
    currentPlan?.status === "ACTIVE" ||
    currentPlan?.status ===
      "TRIALING";

  const currentPlanId =
    currentPlan?.plan?._id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#060B16]/95 p-6 backdrop-blur-2xl">
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-indigo-200">
              <Sparkles size={14} />

              Premium Cloud Plans
            </div>

            <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-white">
              Plans & Pricing
            </h2>

            <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-white/45">
              Scalable storage and
              bandwidth plans for modern
              upload workloads.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() =>
                setPeriod("monthly")
              }
              className={`rounded-xl px-5 py-2.5 text-[11px] font-medium transition ${
                period === "monthly"
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() =>
                setPeriod("yearly")
              }
              className={`rounded-xl px-5 py-2.5 text-[11px] font-medium transition ${
                period === "yearly"
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Errors */}
      {paymentError && (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.04] px-5 py-4 text-[11px] text-red-200 backdrop-blur-xl">
          {paymentError}
        </div>
      )}

      {planError && (
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/[0.04] px-5 py-4 text-[11px] text-amber-100 backdrop-blur-xl">
          {planError}
        </div>
      )}

      {planLoading && (
        <div className="rounded-3xl border border-white/10 bg-[#060B16]/95 px-5 py-4 text-[11px] text-white/45 backdrop-blur-xl">
          Loading your current plan...
        </div>
      )}

      {/* Current Plan */}
      {isSubscribed &&
        currentPlan && (
          <div className="flex flex-col gap-4 rounded-[28px] border border-emerald-500/15 bg-emerald-500/[0.04] p-5 backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Crown
                  size={18}
                  className="text-emerald-300"
                />
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-white">
                  Current Plan:{" "}
                  {currentPlan.plan
                    ?.name ||
                    "Active Plan"}
                </h3>

                <p className="mt-1 text-[10.5px] text-white/45">
                  Status:{" "}
                  {currentPlan.status} •
                  Expires on{" "}
                  {new Date(
                    currentPlan.expiresAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.history.pushState(
                  {},
                  "",
                  "/billing"
                );

                window.dispatchEvent(
                  new PopStateEvent(
                    "popstate"
                  )
                );
              }}
              className="flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-[11px] font-medium text-white transition hover:bg-white/[0.06]"
            >
              Manage Billing
            </button>
          </div>
        )}

      {/* Plans */}
      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan, index) => {
          const popular =
            index === 1;

          return (
            <div
              key={plan._id}
              className={`relative overflow-hidden rounded-[32px] border backdrop-blur-2xl transition-all duration-300 ${
                currentPlanId ===
                plan._id
                  ? "border-indigo-500/30 bg-indigo-500/[0.04]"
                  : "border-white/10 bg-[#060B16]/95"
              } ${
                popular
                  ? "scale-[1.02]"
                  : ""
              }`}
            >
              {/* Glow */}
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

              {/* Popular Badge */}
              {popular && (
                <div className="absolute right-5 top-5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-medium text-indigo-200">
                  Most Popular
                </div>
              )}

              <div className="relative p-6">
                {/* Head */}
                <div className="border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={15}
                      className="text-white/45"
                    />

                    <h3 className="text-[16px] font-semibold text-white">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="mt-2 text-[10.5px] leading-relaxed text-white/40">
                    {plan.storageLimit} GB
                    storage •{" "}
                    {
                      plan.bandwidthLimit
                    }{" "}
                    GB bandwidth
                  </p>

                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-[34px] font-semibold tracking-tight text-white">
                      {formatPrice(
                        plan.monthlyPrice,
                        period
                      ).split("/")[0]}
                    </span>

                    <span className="pb-1 text-[11px] text-white/40">
                      /
                      {period ===
                      "monthly"
                        ? "month"
                        : "year"}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  {defaultFeatures(
                    plan.name
                  ).map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check
                          size={11}
                          className="text-emerald-300"
                        />
                      </div>

                      <span className="text-[11px] text-white/70">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() =>
                      handleBuy(plan)
                    }
                    disabled={
                      payingPlanId ===
                        plan._id ||
                      isSubscribed
                    }
                    className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[11px] font-semibold transition ${
                      currentPlanId ===
                        plan._id &&
                      isSubscribed
                        ? "bg-white/10 text-white/50"
                        : "bg-white text-black hover:bg-white/90"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {payingPlanId ===
                    plan._id ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />

                        Starting...
                      </>
                    ) : currentPlanId ===
                        plan._id &&
                      isSubscribed ? (
                      "Current Plan"
                    ) : (
                      <>
                        {plan.monthlyPrice ===
                        0
                          ? "Get Started"
                          : "Upgrade Now"}

                        <ArrowRight
                          size={14}
                        />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      window.history.pushState(
                        {},
                        "",
                        "/support"
                      );

                      window.dispatchEvent(
                        new PopStateEvent(
                          "popstate"
                        )
                      );
                    }}
                    className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[11px] font-medium text-white transition hover:bg-white/[0.06]"
                  >
                    Contact Sales
                  </button>
                </div>

                {/* Current */}
                {currentPlanId ===
                  plan._id &&
                  isSubscribed && (
                    <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.05] px-4 py-3 text-center text-[10.5px] text-indigo-200">
                      Your active subscription
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="rounded-[28px] border border-white/10 bg-[#060B16]/95 px-6 py-5 text-center backdrop-blur-2xl">
        <p className="text-[10.5px] leading-relaxed text-white/40">
          All plans include secure uploads,
          encrypted storage, resumable
          transfers, and real-time upload
          analytics.
        </p>
      </div>
    </div>
  );
}