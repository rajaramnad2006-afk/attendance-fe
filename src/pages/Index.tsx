import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/utils/attendance";

export default function Index() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null;
}
