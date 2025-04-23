
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import PrisonBackground from "@/components/PrisonBackground";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeValue, setTimeValue] = useState<number>(5);
  
  useEffect(() => {
    // Проверяем, есть ли у пользователя активный срок
    const prisonEndTime = localStorage.getItem("prisonEndTime");
    if (prisonEndTime && new Date(prisonEndTime) > new Date()) {
      navigate("/prison");
    }
  }, [navigate]);

  const handleStartPrison = () => {
    if (timeValue <= 0) {
      toast({
        title: "Ошибка",
        description: "Срок должен быть больше 0 минут",
        variant: "destructive"
      });
      return;
    }
    
    // Устанавливаем время окончания срока
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + timeValue);
    localStorage.setItem("prisonEndTime", endTime.toISOString());
    localStorage.setItem("prisonDuration", timeValue.toString());
    
    // Переходим на страницу тюрьмы
    navigate("/prison");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <PrisonBackground />
      
      <Card className="w-[350px] bg-gray-900/90 border-gray-700 text-gray-200 backdrop-blur-sm relative z-10">
        <CardHeader>
          <CardTitle className="text-3xl font-pixel text-center">ТЮРЬМА</CardTitle>
          <CardDescription className="text-gray-400 font-pixel text-center">
            Выберите срок вашего заключения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="time" className="font-pixel">Срок (в минутах)</Label>
              <Input
                id="time"
                type="number"
                value={timeValue}
                onChange={(e) => setTimeValue(Number(e.target.value))}
                className="bg-gray-800 border-gray-700 font-pixel"
                min="1"
                max="60"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStartPrison} 
            className="w-full font-pixel bg-gray-700 hover:bg-gray-600"
          >
            НАЧАТЬ ОТБЫВАТЬ СРОК
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
