import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeDisplayProps {
  code: string;
  room: string;
}

export function CodeDisplay({ code, room }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-2xl gradient-primary p-8 text-center shadow-glow-primary"
    >
      <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-widest mb-2">
        Attendance Code
      </p>
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-5xl md:text-6xl font-mono-code font-bold text-primary-foreground tracking-[0.2em]">
          {code}
        </h1>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
        >
          {copied ? (
            <Check className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Copy className="w-5 h-5 text-primary-foreground" />
          )}
        </button>
      </div>
      <p className="text-primary-foreground/60 mt-3 text-sm">
        Room: <span className="font-semibold text-primary-foreground">{room}</span>
      </p>
    </motion.div>
  );
}
