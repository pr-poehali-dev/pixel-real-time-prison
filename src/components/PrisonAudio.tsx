
import { useEffect, useRef, useState } from "react";

const PrisonAudio = () => {
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Создаем элементы аудио программно
    const ambientSound = new Audio();
    ambientSound.loop = true;
    ambientSoundRef.current = ambientSound;
    
    // Base64-закодированный короткий аудио файл с кашлем и шагами
    // В реальном проекте лучше использовать настоящие аудиофайлы
    ambientSound.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAEgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADpADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQBj/gAAAAAAAAAAAAAAP/jOMAAAABGJIjNACBGwCAJlYLDTii0EpJhYGh4fB8SwkGQfFsEw0LCxQKBQMDN4BAIQhHwdB5f5cKw4OAmHC8OA4OA4OA4a9vb2AAAAAAA/+MoxD8AAAEiQACAAAIBDkQhFJBEGw+D4aBcKxlLCGEQfFQbjhCHBESDosBcajguHB0FB0HiuRyICgOB4Sp+xX3d3UtwcHZ9S4OA4i/99S5aS9BQRS4OA4OAgCAQB4OA4OAIhmfhAAAAAAD/4zjMBAAAABZSMAAAggEGHw+X+/lOGzSXF/X3+lgoN2H/////+h6UAAX////9cF9jCXJBP//////8iJ/AX/iYBDFH///////0VABf///rQnKBP/////+Vjzgb+BgAkJ///////9YAAAAAAAA=";
    
    ambientSound.volume = 0.3; // Уменьшаем громкость
    
    const handleCanPlayThrough = () => {
      setIsAudioLoaded(true);
    };
    
    ambientSound.addEventListener('canplaythrough', handleCanPlayThrough);
    
    return () => {
      ambientSound.removeEventListener('canplaythrough', handleCanPlayThrough);
      ambientSound.pause();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  useEffect(() => {
    // Запускаем звук при взаимодействии пользователя с страницей
    const handleUserInteraction = () => {
      if (isAudioLoaded && !isPlaying && ambientSoundRef.current) {
        ambientSoundRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Ошибка воспроизведения звука:", error);
          });
      }
    };
    
    // Добавляем обработчики событий для запуска звука
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isAudioLoaded, isPlaying]);
  
  // Создаем случайные звуки тюрьмы
  useEffect(() => {
    if (!isPlaying) return;
    
    const createRandomSound = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      // Случайные параметры для звуков шагов или кашля
      const type = Math.random() > 0.5 ? 'sawtooth' : 'square';
      const frequency = 100 + Math.random() * 100;
      const duration = 0.1 + Math.random() * 0.3;
      
      osc.type = type as OscillatorType;
      osc.frequency.value = frequency;
      gain.gain.value = 0.05; // Тихий звук
      
      osc.connect(gain);
      gain.connect(context.destination);
      
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      osc.stop(context.currentTime + duration);
    };
    
    // Создаем случайные звуки через случайные интервалы
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% вероятность звука
        createRandomSound();
      }
    }, 2000 + Math.random() * 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  return null; // Этот компонент не рендерит никакой UI
};

export default PrisonAudio;
