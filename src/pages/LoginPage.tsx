import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, User, Hash, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setUser } from "@/utils/attendance";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "teacher" | null>(null);
  const [name, setName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    if (!role) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }

    if (role === "teacher" && !name.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }

    if (role === "student" && (!registerNumber.trim() || !password.trim())) {
      toast({ title: "Please enter both Register Number and Password", variant: "destructive" });
      return;
    }

    if (role === "student") {
      // In a real app we would authenticate the password here
      setUser({ name: registerNumber.trim(), role });
    } else {
      setUser({ name: name.trim(), role });
    }
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow-primary">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold gradient-text">AttendEase</h1>
          <p className="text-muted-foreground mt-1 text-sm">Smart Attendance Management</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-card-foreground">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "student" as const, label: "Student", icon: User },
                { value: "teacher" as const, label: "Teacher", icon: BookOpen },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRole(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === opt.value
                      ? "border-primary bg-primary/5 shadow-glow-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <opt.icon className={`w-6 h-6 ${role === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${role === opt.value ? "text-primary" : "text-muted-foreground"}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {role === "teacher" && (
              <motion.div
                key="teacher"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {role === "student" && (
              <motion.div
                key="student"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Register Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your register number"
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleLogin}
            disabled={!role}
            className="w-full h-11 gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-90 transition-opacity"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
