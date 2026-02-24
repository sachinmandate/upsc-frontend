import { subscriptionPlans, paymentHistory } from "../../data/dashboardData";
import {
  CreditCard,
  CheckCircle2,
  Crown,
  ArrowRight,
  Receipt,
} from "lucide-react";

const Payments = () => {
  const currentPlan = subscriptionPlans.find((p) => p.current);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Payments & Plans</h1>
        <p className="text-sm text-slate-500">Manage your subscription and billing</p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 flex items-center justify-center shrink-0">
              <Crown size={22} className="text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Current Plan</p>
              <p className="text-xl font-bold text-slate-900">{currentPlan?.name || "Free"}</p>
              <p className="text-xs text-slate-400 mt-0.5">Next billing: 01 Mar 2026</p>
            </div>
          </div>
          <button className="btn-secondary text-xs py-2 px-4">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Subscription Plans</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border shadow-sm p-5 relative transition-all ${
                plan.current
                  ? "border-slate-800 ring-1 ring-slate-800"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-4 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                  Most Popular
                </span>
              )}

              <p className="text-lg font-bold text-slate-900 mb-1">{plan.name}</p>
              <div className="mb-4">
                {plan.price === 0 ? (
                  <p className="text-2xl font-bold text-slate-900">Free</p>
                ) : (
                  <p className="text-2xl font-bold text-slate-900">
                    <span className="text-base font-normal text-slate-400">Rs.</span> {plan.price}
                    <span className="text-sm font-normal text-slate-400">/{plan.period}</span>
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <button className="btn-secondary w-full text-xs py-2 cursor-default" disabled>
                  Current Plan
                </button>
              ) : plan.price > (currentPlan?.price || 0) ? (
                <button className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1">
                  Upgrade <ArrowRight size={14} />
                </button>
              ) : (
                <button className="btn-secondary w-full text-xs py-2">
                  Downgrade
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Receipt size={16} className="text-slate-400" />
          <h2 className="text-base font-bold text-slate-900">Payment History</h2>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <CreditCard size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No payment history yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <CreditCard size={18} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{payment.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{payment.date} &middot; {payment.method}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-[52px] sm:pl-0 shrink-0">
                  <span className="text-sm font-bold text-slate-800">Rs. {payment.amount}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-green-100 text-green-700">
                    <CheckCircle2 size={10} />
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
