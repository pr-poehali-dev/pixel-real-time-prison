
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrisonCell from "@/components/PrisonCell";
import PrisonTimer from "@/components/PrisonTimer";
import PrisonAudio from "@/components/PrisonAudio";

const PrisonPage = () => {
  const navigate = useNavigate();
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const prisonEndTimeStr = localStorage.getItem("prisonEndTime");
    const prisonDurationStr = localStorage.getItem("prisonDuration");
    
    if (!prisonEndTimeStr) {
      navigate("/");
      return;
    }
    
    const endTimeDate = new Date(prisonEndTimeStr);
    
    // Если срок уже истек, перенаправляем на главную
    if (endTimeDate < new Date()) {
      localStorage.removeItem("prisonEndTime");
      localStorage.removeItem("prisonDuration");
      navigate("/");
      return;
    }
    
    setEndTime(endTimeDate);
    setDuration(prisonDurationStr ? parseInt(prisonDurationStr) : 0);
    setIsLoaded(true);
  }, [navigate]);

  // Если пользователь пытается покинуть страницу, предупредим его
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Ваш срок еще не окончен. Вы уверены, что хотите покинуть тюрьму?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (!isLoaded || !endTime) {
    return <div className="min-h-screen bg-gray-900"></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900 relative">
      <PrisonAudio />
      <PrisonCell />
      <PrisonTimer endTime={endTime} duration={duration} />
    </div>
  );
};

export default PrisonPage;
