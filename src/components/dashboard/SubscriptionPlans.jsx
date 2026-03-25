import { useState } from "react";
import { 
  Check, 
  Zap, 
  ShieldCheck, 
  Crown, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { studentApi } from "../../api/studentApi";
import { toast } from "sonner";

const PLANS = [
  {
    id: "MONTHLY",
    name: "Pro Monthly",
    price: 999,
    period: "month",
    description: "Perfect for students starting their preparation journey.",
    features: [
      "Access to 1 Paid Teacher",
      "Unlimited Video Watch Time",
      "Downloadable PDF Notes",
      "Daily Practice Assignments",
      "Weekly Mock Tests",
      "Group Chat Access"
    ],
    icon: <Zap className="text-amber-500" size={24} />,
    color: "amber"
  },
  {
    id: "QUARTERLY",
    name: "Success Quarterly",
    price: 2499,
    period: "3 months",
    description: "Best for focused preparation with multiple faculty.",
    features: [
      "Access to 3 Paid Teachers",
      "Everything in Monthly",
      "Personalized Doubt Sessions",
      "Previous Year Solved Papers",
      "Priority Chat Support",
      "Syllabus Tracking"
    ],
    icon: <ShieldCheck className="text-indigo-500" size={24} />,
    highlight: true,
    color: "indigo"
  },
  {
    id: "YEARLY",
    name: "Officer Premium",
    price: 7999,
    period: "year",
    description: "Comprehensive access for serious UPSC/MPSC aspirants.",
    features: [
      "Access to ALL Paid Teachers",
      "Everything in Quarterly",
      "1-on-1 Mentorship",
      "Interview Preparation",
      "Printed Materials (Offline)",
      "Exclusive Webinars"
    ],
    icon: <Crown className="text-slate-900" size={24} />,
    color: "slate"
  }
];

const SubscriptionPlans = () => {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (plan) => {
    setLoading(plan.id);
    try {
      // 1. Initiate Payment (Simulated)
      const paymentData = {
        teacherId: 1, // Default or specific teacher
        paymentType: "SUBSCRIPTION",
        amount: plan.price,
        currency: "INR",
        paymentMethod: "UPI",
        planId: plan.id
      };

      const initResponse = await studentApi.initiatePayment(paymentData);
      
      // 2. Simulate Payment Verification
      // In a real app, this would happen after Razorpay/Stripe callback
      setTimeout(async () => {
          try {
              const verifyResponse = await studentApi.verifyPayment(
                  initResponse.id, 
                  "sim_tx_" + Math.random().toString(36).substring(7)
              );
              toast.success(`Successfully subscribed to ${plan.name}!`);
          } catch (err) {
              toast.error("Payment verification failed");
          } finally {
              setLoading(null);
          }
      }, 2000);

    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to process subscription");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Choose Your Prep Plan</h1>
        <p className="text-slate-500 leading-relaxed">
          Get unlimited access to premium lectures, notes, and expert guidance to crack your exams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col bg-white border-2 transition-all duration-300 ${
              plan.highlight 
                ? "border-indigo-600 shadow-xl scale-105 z-10" 
                : "border-slate-100 hover:border-slate-300 shadow-sm"
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Most Popular
              </div>
            )}

            <div className="p-6 sm:p-8 flex-1">
              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.color === 'amber' ? 'bg-amber-50' : 
                    plan.color === 'indigo' ? 'bg-indigo-50' : 'bg-slate-100'
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1 h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">₹{plan.price}</span>
                  <span className="text-slate-400 font-medium text-sm">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">What's included</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-indigo-600' : 'text-slate-400'}`}>
                      <Check size={16} />
                    </div>
                    <span className="text-sm text-slate-600 leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 mt-auto">
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading !== null}
                className={`w-full py-4 px-6 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    : "bg-slate-900 text-white hover:bg-black"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Get Started
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-sm p-6 text-center max-w-3xl mx-auto">
        <p className="text-sm text-slate-500 italic">
          "The investment in knowledge pays the best interest." — Benjamin Franklin
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
