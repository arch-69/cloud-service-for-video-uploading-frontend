import { useEffect, useState } from 'react';
import httpClient from '../../api/httpClient';
import { Check } from 'lucide-react';
import { getSubscriptionIdApi } from '../../api/razorpay.api';

function formatPrice(price, period) {
  if (price === 0) return 'Free';
  if (period === 'yearly') {
    const yearly = price * 12 * 0.9; // example: 10% off yearly
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [payingPlanId, setPayingPlanId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await httpClient.get('/v1/public/get-plans');
        if (!mounted) return;
        if (res?.data?.success) {
          setPlans(res.data.data || []);
        } else {
          setError(res?.data?.message || 'Failed to fetch plans');
        }
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to fetch plans');
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
    if (planName.toLowerCase() === 'free') {
      return [
        '1 GB total storage',
        '10 GB bandwidth / month',
        'Max file size 100 MB',
        'Basic support',
      ];
    }
    return [
      '10 GB total storage',
      '20 GB bandwidth / month',
      'Max file size 1 GB',
      'Priority support',
      'Faster uploads & resume',
    ];
  };

  const loadRazorpay = () =>
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('No window'));
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });

  const handleBuy = async (plan) => {
    setPaymentError(null);
    setPayingPlanId(plan._id);

    const isSubscribed = currentPlan?.status === 'ACTIVE' || currentPlan?.status === 'TRIALING';
    if (isSubscribed) {
      setPaymentError('You already have an active subscription. Manage your plan in billing.');
      setPayingPlanId(null);
      return;
    }

    try {
      const key = (import.meta.env?.VITE_RAZORPAY_KEY || '').trim();
      if (!key) throw new Error('Razorpay key is missing');

      const subscriptionId = await getSubscriptionIdApi(plan._id);
      if (!subscriptionId) throw new Error('No subscription id returned');

      await loadRazorpay();

      const options = {
        key,
        name: 'CloudDock',
        description: `${plan.name} plan subscription`,
        subscription_id: subscriptionId,
        image: '/favicon.svg',
        notes: {
          planId: plan._id,
          period,
        },
        theme: { color: '#4f46e5' },
        handler: function () {
          // TODO: verify payment with backend after Razorpay callback
          window.history.pushState({}, '', '/billing/success');
          window.dispatchEvent(new PopStateEvent('popstate'));
        },
        modal: {
          ondismiss: () => {
            setPayingPlanId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      if (err?.response?.status === 409) {
        setPaymentError('You already have an active subscription. Manage your plan in billing.');
        onRefreshCurrentPlan?.();
      } else {
        setPaymentError(err?.message || 'Payment initialization failed');
      }
    } finally {
      setPayingPlanId(null);
    }
  };

  if (loading) return <div className="card">Loading plans…</div>;
  if (error) return <div className="card">Error loading plans: {error}</div>;

  const isSubscribed = currentPlan?.status === 'ACTIVE' || currentPlan?.status === 'TRIALING';
  const currentPlanId = currentPlan?.plan?._id;

  return (
    <div className="card pricing-panel">
      <div className="pricing-header">
        <div>
          <h3>Plans & Pricing</h3>
          <p className="muted">Real cloud plans for real workloads. Upgrade anytime.</p>
        </div>

        <div className="pricing-toggle">
          <button className={`ghost-button ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>Monthly</button>
          <button className={`ghost-button ${period === 'yearly' ? 'active' : ''}`} onClick={() => setPeriod('yearly')}>Yearly (10% off)</button>
        </div>
      </div>

      {paymentError && (
        <div className="card" style={{ marginBottom: 12, borderLeft: '4px solid #ef4444' }}>
          {paymentError}
        </div>
      )}

      {planError && (
        <div className="card" style={{ marginBottom: 12, borderLeft: '4px solid #f59e0b' }}>
          {planError}
        </div>
      )}

      {planLoading && (
        <div className="card" style={{ marginBottom: 12 }}>
          Loading your current plan…
        </div>
      )}

      {isSubscribed && currentPlan && (
        <div className="card current-plan-banner">
          <div>
            <h4>Current plan: {currentPlan.plan?.name || 'Active plan'}</h4>
            <p className="muted small">
              Status: {currentPlan.status} • Expires on {new Date(currentPlan.expiresAt).toLocaleDateString()}
            </p>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              window.history.pushState({}, '', '/billing');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Manage billing
          </button>
        </div>
      )}

      <div className="pricing-grid" style={{ marginTop: 16 }}>
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`card pricing-card ${isSubscribed ? 'pricing-card--disabled' : ''} ${currentPlanId === plan._id ? 'pricing-card--current' : ''}`}
          >

            <div className="pricing-card__head">
              <div>
                <h4 className="plan-name">{plan.name}</h4>
                <div className="muted small">{plan.storageLimit} GB storage • {plan.bandwidthLimit} GB bandwidth</div>
              </div>

              <div className="price-block">
                <div className="price">{formatPrice(plan.monthlyPrice, period)}</div>
                <div className="muted small">{period === 'monthly' ? 'billed monthly' : 'billed yearly'}</div>
              </div>
            </div>

            <ul className="features">
              {(defaultFeatures(plan.name) || []).map((f) => (
                <li key={f}><Check size={14} /> <span>{f}</span></li>
              ))}
            </ul>

            <div className="pricing-cta">
              <button
                className="primary-button"
                onClick={() => handleBuy(plan)}
                disabled={payingPlanId === plan._id || isSubscribed}
              >
                {currentPlanId === plan._id && isSubscribed
                  ? 'Current plan'
                  : payingPlanId === plan._id
                  ? 'Starting...'
                  : isSubscribed
                  ? 'Subscribed'
                  : `Buy ${plan.monthlyPrice === 0 ? 'Free' : ''}`}
              </button>
              <button className="secondary-button" onClick={() => {
                window.history.pushState({}, '', '/support');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}>Contact sales</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
