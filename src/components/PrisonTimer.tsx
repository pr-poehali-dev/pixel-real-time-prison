
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PrisonTimerProps {
  endTime: Date;
  duration: number;
}

const PrisonTimer: React.FC<PrisonTimerProps> = ({ endTime, duration }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [percentComplete, setPercentComplete] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diffMs = endTime.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        // Срок закончился
        localStorage.removeItem("prisonEndTime");
        localStorage.removeItem("prisonDuration");
        navigate("/");
        return 0;
      }
      
      return Math.max(0, Math.floor(diffMs / 1000));
    };

    const calculatePercentage = (secondsLeft: number) => {
      const totalSeconds = duration * 60;
      const secondsPassed = totalSeconds - secondsLeft;
      return Math.min(100, Math.floor((secondsPassed / totalSeconds) * 100));
    };

    // Инициализируем начальное значение
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);
    setPercentComplete(calculatePercentage(initialTimeLeft));

    // Обновляем таймер каждую секунду
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setPercentComplete(calculatePercentage(newTimeLeft));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, duration, navigate]);

  // Форматируем время в формат ЧЧ:ММ:СС
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-gray-900 border-t-4 border-gray-700 z-20 font-pixel">
      <div className="container mx-auto text-center">
        <p className="text-gray-400 mb-1">ОСТАЛОСЬ СИДЕТЬ:</p>
        <p className="text-4xl text-gray-200 mb-2 font-bold tracking-wider">{formatTime(timeLeft)}</p>
        
        <div className="w-full bg-gray-800 h-4 rounded-sm overflow-hidden border border-gray-700">
          <div 
            className="h-full bg-gray-500 transition-all duration-1000" 
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
        
        <p className="text-gray-500 mt-2 text-sm">
          Срок заключения: {duration} мин. • Отбыто: {percentComplete}%
        </p>
      </div>
    </div>
  );
};

export default PrisonTimer;
