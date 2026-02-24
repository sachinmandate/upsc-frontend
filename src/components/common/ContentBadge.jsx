import { Lock, Unlock } from "lucide-react";

const ContentBadge = ({ tier, size = "sm" }) => {
  const isFree = tier === "free";
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";
  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider rounded-sm ${sizeClasses} ${
        isFree
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {isFree ? <Unlock size={iconSize} /> : <Lock size={iconSize} />}
      {isFree ? "Free" : "Pro"}
    </span>
  );
};

export default ContentBadge;
