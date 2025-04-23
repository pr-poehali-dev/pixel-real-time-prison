
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrisonCell from "@/components/PrisonCell";
import PrisonTimer from "@/components/PrisonTimer";
import PrisonAudio from "@/components/PrisonAudio";
import PrisonCredits from "@/components/PrisonCredits";

const PrisonPage = () => {
  const navigate = useNavigate();
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fadeWhite, setFadeWhite] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

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
      handleComplete();
      return;
    }
    
    setEndTime(endTimeDate);
    setDuration(prisonDurationStr ? parseInt(prisonDurationStr) : 0);
    setIsLoaded(true);
  }, [navigate]);

  const handleComplete = () => {
    setIsCompleted(true);
    
    // Сначала медленно осветляем экран
    setTimeout(() => {
      setFadeWhite(true);
      
      // После полного осветления показываем субтитры
      setTimeout(() => {
        setShowCredits(true);
        localStorage.removeItem("prisonEndTime");
        localStorage.removeItem("prisonDuration");
      }, 3000);
    }, 1000);
  };

  // Если пользователь пытается покинуть страницу, предупредим его
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isCompleted) {
        e.preventDefault();
        e.returnValue = "Ваш срок еще не окончен. Вы уверены, что хотите покинуть тюрьму?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isCompleted]);

  if (!isLoaded && !isCompleted) {
    return <div className="min-h-screen bg-gray-900"></div>;
  }

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center overflow-hidden relative transition-colors duration-3000 ${
        fadeWhite ? 'bg-white' : 'bg-gray-900'
      }`}
    >
      {!showCredits ? (
        <>
          {!isCompleted && <PrisonAudio />}
          <div className={`transition-opacity duration-3000 ${fadeWhite ? 'opacity-0' : 'opacity-100'}`}>
            <PrisonCell />
          </div>
          {endTime && !isCompleted && (
            <PrisonTimer endTime={endTime} duration={duration} onComplete={handleComplete} />
          )}
        </>
      ) : (
        <PrisonCredits />
      )}
    </div>
  );
};

export default PrisonPage;
