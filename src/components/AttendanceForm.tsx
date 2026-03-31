import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitAttendance } from "@/utils/attendance";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AttendanceFormProps {
  studentName: string;
}

export function AttendanceForm({ studentName }: AttendanceFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast({ title: "Camera error", description: "Failed to access camera", variant: "destructive" });
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setPhoto(canvas.toDataURL("image/jpeg", 0.6));
        stopCamera();
        setIsCameraOpen(false);
        toast({ title: "Photo captured" });
      }
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({ title: "Enter a code", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = await submitAttendance(studentName, code, location, photo);
    toast({
      title: result.success ? "✅ Success" : "❌ Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    if (result.success) {
      setCode("");
      setPhoto(null);
      setLocation(null);
    }
    setLoading(false);
  };

  return (
    <>
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

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={getLocation}
            disabled={locLoading || !!location}
            className="flex-1 h-11"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {location ? "Located ✓" : locLoading ? "Getting..." : "Get Location"}
          </Button>
          <Button 
            variant={photo ? "default" : "outline"} 
            className="flex-1 h-11 focus:ring-2 focus:ring-ring" 
            onClick={startCamera}
            disabled={!!photo}
          >
            <Camera className="w-4 h-4 mr-2" />
            {photo ? "Captured ✓" : "Selfie (Preview)"}
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !code.trim() || (!photo && false)} // optionally require photo here
          className="w-full h-12 gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? "Submitting..." : "Submit Attendance"}
        </Button>
      </motion.div>

      <Dialog open={isCameraOpen} onOpenChange={(open) => {
        if (!open) {
          stopCamera();
          setIsCameraOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Selfie</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <Button onClick={capturePhoto} className="w-full p-6 text-lg">
              <Camera className="w-5 h-5 mr-3" />
              Capture Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
