import { useLocation, useNavigate } from "react-router-dom";
import { Home, CreditCard, ShoppingBag, Zap } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Home, label: "홈" },
  { path: "/cards", icon: CreditCard, label: "카드관리" },
  { path: "/products", icon: ShoppingBag, label: "상품" },
  { path: "/simulation", icon: Zap, label: "시뮬레이션" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNav;
