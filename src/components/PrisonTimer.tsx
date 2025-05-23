
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PrisonTimerProps {
  endTime: Date;
  duration: number;
  onComplete: () => void;
}

const PrisonTimer: React.FC<PrisonTimerProps> = ({ endTime, duration, onComplete }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [percentComplete, setPercentComplete] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("complete");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diffMs = endTime.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        // Срок закончился
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onComplete();
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
    intervalRef.current = window.setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setPercentComplete(calculatePercentage(newTimeLeft));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [endTime, duration, navigate, onComplete]);

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

  const handlePasswordSubmit = () => {
    if (password === "1111") {
      localStorage.removeItem("prisonEndTime");
      localStorage.removeItem("prisonDuration");
      navigate("/");
    } else {
      setPasswordError("Неверный пароль");
    }
  };

  const handleCompleteGame = () => {
    onComplete();
    setDialogOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && activeTab === "exit") {
      handlePasswordSubmit();
    }
  };

  return (
    <>
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
          
          <div className="mt-3">
            <button 
              onClick={() => setDialogOpen(true)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-300 font-pixel underline"
            >
              МЕНЮ ЗАКЛЮЧЕННОГО
            </button>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-200 font-pixel">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-200 mb-4">МЕНЮ ЗАКЛЮЧЕННОГО</DialogTitle>
          </DialogHeader>
          
          <Tabs 
            defaultValue="complete" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
              <TabsTrigger 
                value="complete" 
                className="data-[state=active]:bg-gray-700"
              >
                ПРОЙТИ ИГРУ
              </TabsTrigger>
              <TabsTrigger 
                value="exit" 
                className="data-[state=active]:bg-gray-700"
              >
                ВЫЙТИ НА ГЛАВНУЮ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="complete" className="mt-4">
              <div className="text-center text-gray-300 mb-4">
                <p>Просмотреть финальные субтитры и завершить игру.</p>
                <p className="text-xs text-gray-500 mt-2">Ваш срок будет считаться отбытым.</p>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  className="font-pixel bg-gray-700 hover:bg-gray-600"
                  onClick={handleCompleteGame}
                >
                  ЗАВЕРШИТЬ ЗАКЛЮЧЕНИЕ
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="exit" className="mt-4">
              <div className="py-2">
                <p className="text-center text-gray-300 mb-3">Введите пароль для выхода на главную страницу:</p>
                <Input
                  type="password"
                  placeholder="Введите пароль..."
                  className="bg-gray-900 border-gray-700 text-gray-200 font-pixel text-center"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-2 text-center">{passwordError}</p>
                )}
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  variant="secondary"
                  className="font-pixel bg-gray-700 hover:bg-gray-600"
                  onClick={handlePasswordSubmit}
                >
                  ПОДТВЕРДИТЬ
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrisonTimer;
