import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitAttendance } from "@/utils/attendance";
import { useToast } from "@/hooks/use-toast";

interface AttendanceFormProps {
  studentName: string;
}

export function AttendanceForm({ studentName }: AttendanceFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const { toast } = useToast();

  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocLoading(false);
        toast({ title: "Location captured", description: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` });
      },
      () => {
        setLocLoading(false);
        toast({ title: "Location unavailable", description: "Proceeding without location.", variant: "destructive" });
      }
    );
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      toast({ title: "Enter a code", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = submitAttendance(studentName, code, location);
      toast({
        title: result.success ? "✅ Success" : "❌ Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      if (result.success) setCode("");
      setLoading(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border space-y-5"
    >
      <h2 className="text-lg font-heading font-semibold text-card-foreground">Mark Attendance</h2>

      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Attendance Code</label>
        <Input
          placeholder="e.g. A101-7XK9"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="font-mono-code text-lg tracking-widest h-12 text-center"
          maxLength={9}
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={getLocation}
          disabled={locLoading || !!location}
          className="flex-1"
        >
          <MapPin className="w-4 h-4 mr-2" />
          {location ? "Located ✓" : locLoading ? "Getting..." : "Get Location"}
        </Button>
        <Button variant="outline" className="flex-1" disabled>
          <Camera className="w-4 h-4 mr-2" />
          Selfie (Preview)
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !code.trim()}
        className="w-full h-12 gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-90 transition-opacity"
      >
        <Send className="w-4 h-4 mr-2" />
        {loading ? "Submitting..." : "Submit Attendance"}
      </Button>
    </motion.div>
  );
}
