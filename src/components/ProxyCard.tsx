import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Sparkles, X } from "lucide-react";
import { useState } from "react";

type ProxyCardVariant2 = "compact" | "full" | "header";

const ProxyCard = ({ variant = "compact" }: { variant?: ProxyCardVariant2 }) => {
  const [open, setOpen] = useState(false);

  const CardDetails = ({ compact = false }: { compact?: boolean }) => {
    return (
      <motion.div
        initial={false}
        className={
          compact ? "relative overflow-hidden rounded-2xl p-4" : "relative overflow-hidden rounded-2xl p-6"
        }
        style={
          compact
            ? {
                background: "linear-gradient(135deg, hsl(214, 93%, 58%), hsl(230, 80%, 55%))",
                boxShadow: "var(--shadow-card)",
              }
            : {
                background: "linear-gradient(135deg, hsl(214, 93%, 58%), hsl(230, 80%, 55%))",
                boxShadow: "var(--shadow-card)",
              }
        }
      >
        {!compact && (
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, hsl(0,0%,100%) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary-foreground" />
              <span className="text-[13px] font-semibold text-primary-foreground opacity-90">
                Master Proxy Card
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-primary-foreground opacity-80" />
          </div>

          <div className="mb-4">
            <p className="text-xs text-primary-foreground opacity-60 mb-1">카드 번호</p>
            <p className="text-base font-mono text-primary-foreground tracking-[0.22em]">
              •••• •••• •••• 7842
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-primary-foreground opacity-60 mb-0.5">이름</p>
              <p className="text-[13px] font-medium text-primary-foreground">이경원</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary-foreground opacity-60 mb-0.5">유효기간</p>
              <p className="text-[13px] font-medium text-primary-foreground">03/28</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const isHeader = variant === "header";

  return (
    <>
      {variant === "full" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardDetails />
        </motion.div>
      ) : (
        <>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            onClick={() => setOpen(true)}
            className={`flex items-center justify-center bg-card border border-border hover:opacity-90 transition-opacity ${
              isHeader ? "w-10 h-10 rounded-full" : "w-14 h-14 rounded-2xl"
            }`}
            aria-label="Proxy Card 정보 보기"
            style={{
              boxShadow: "var(--shadow-card)",
              background:
                "linear-gradient(135deg, hsl(214, 93%, 58%), hsl(230, 80%, 55%))",
            }}
          >
            <CreditCard className={isHeader ? "w-5 h-5 text-primary-foreground" : "w-6 h-6 text-primary-foreground"} />
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-50 bg-foreground/40 flex items-end justify-center sm:items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  className="w-full max-w-md bg-card rounded-3xl shadow-lg overflow-hidden"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ type: "spring", damping: 22, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-card-foreground">Proxy Card</span>
                    </div>
                    <button
                      className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                      onClick={() => setOpen(false)}
                      aria-label="닫기"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <CardDetails compact />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default ProxyCard;
