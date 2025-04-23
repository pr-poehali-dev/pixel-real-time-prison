
import { useEffect, useState } from "react";

// Типы данных для генерации случайного заключенного
interface PrisonerData {
  name: string;
  height: number;
  weight: number;
  location: string;
  crime: string;
  sentence: number;
  fate: string;
}

const PrisonCredits = () => {
  const [creditsPosition, setCreditsPosition] = useState(100);
  const [prisonerData, setPrisonerData] = useState<PrisonerData | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  // Генерация случайного заключенного при первой загрузке
  useEffect(() => {
    // Массивы случайных данных
    const names = ["Иван Петров", "Сергей Смирнов", "Алексей Кузнецов", "Дмитрий Волков", 
                   "Михаил Соколов", "Андрей Морозов", "Николай Лебедев", "Егор Комаров"];
    
    const locations = ["Москва, район Ясенево", "Санкт-Петербург, Петроградская сторона", 
                        "Екатеринбург, Уралмаш", "Казань, Старый город", 
                        "Новосибирск, Академгородок", "Владивосток, Эгершельд"];
    
    const crimes = ["Кража цифровых данных", "Взлом государственной системы", 
                     "Распространение запрещённого ПО", "Кибертерроризм", 
                     "Создание вредоносного кода", "Информационное мошенничество"];
    
    const fates = ["Условно освобождён", "Отправлен на принудительные работы", 
                    "Переведён в другое учреждение", "Амнистирован", 
                    "Направлен на перевоспитание", "Восстановлен в гражданских правах"];
    
    // Выбираем случайные значения
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomHeight = Math.floor(Math.random() * (195 - 165) + 165);
    const randomWeight = Math.floor(Math.random() * (100 - 65) + 65);
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomCrime = crimes[Math.floor(Math.random() * crimes.length)];
    const randomSentence = Math.floor(Math.random() * (10 - 1) + 1);
    const randomFate = fates[Math.floor(Math.random() * fates.length)];
    
    // Создаем объект с данными заключенного
    setPrisonerData({
      name: randomName,
      height: randomHeight,
      weight: randomWeight,
      location: randomLocation,
      crime: randomCrime,
      sentence: randomSentence,
      fate: randomFate
    });
  }, []);

  // Анимация движения субтитров
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setCreditsPosition(prev => {
        // Когда текст полностью прокрутится вверх, сбросим позицию
        if (prev <= -400) {
          return 100;
        }
        return prev - 0.3; // Медленная скорость движения
      });
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  // Включение музыки для субтитров
  useEffect(() => {
    const audio = new Audio();
    audio.src = "https://cdn.pixabay.com/download/audio/2022/01/18/audio_5850a7203b.mp3?filename=sad-piano-and-cello-14476.mp3";
    audio.volume = 0.2;
    audio.loop = true;
    
    // Воспроизведение музыки при взаимодействии пользователя
    const playAudio = () => {
      if (!audioPlaying) {
        audio.play()
          .then(() => {
            setAudioPlaying(true);
          })
          .catch(error => {
            console.error("Ошибка воспроизведения музыки:", error);
          });
      }
    };
    
    // Подписываемся на события для запуска музыки
    document.addEventListener('click', playAudio);
    
    // Воспроизводим, если страница уже в фокусе
    if (document.hasFocus()) {
      playAudio();
    }
    
    return () => {
      audio.pause();
      document.removeEventListener('click', playAudio);
    };
  }, [audioPlaying]);

  // Если данные заключенного еще не сгенерированы
  if (!prisonerData) {
    return <div className="w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <p className="text-gray-800 text-2xl font-mono">Загрузка данных...</p>
    </div>;
  }

  // Формируем текст субтитров с данными о заключенном
  const creditsText = `
    ДЕЛО №${Math.floor(Math.random() * 9000) + 1000}-PRSN
    
    СИСТЕМА ИСПОЛНЕНИЯ НАКАЗАНИЙ
    ЗАКЛЮЧИТЕЛЬНЫЙ ОТЧЕТ
    
    ИМЯ ЗАКЛЮЧЕННОГО: ${prisonerData.name}
    ФИЗИЧЕСКИЕ ДАННЫЕ:
      - Рост: ${prisonerData.height} см
      - Вес: ${prisonerData.weight} кг
    
    МЕСТО ПРОЖИВАНИЯ: 
    ${prisonerData.location}
    
    ПРЕСТУПЛЕНИЕ: 
    ${prisonerData.crime}
    
    НАЗНАЧЕННЫЙ СРОК: 
    ${prisonerData.sentence} лет виртуального заключения
    
    ОТБЫТЫЙ СРОК:
    ${localStorage.getItem("prisonDuration") || "?"} минут в ускоренном режиме
    
    ПОВЕДЕНИЕ ВО ВРЕМЯ ЗАКЛЮЧЕНИЯ:
    Заключенный проявлял признаки нетерпения.
    Отмечены попытки досрочного освобождения.
    
    ИТОГОВОЕ РЕШЕНИЕ СИСТЕМЫ:
    ${prisonerData.fate}
    
    ПРИМЕЧАНИЕ НАДЗИРАТЕЛЯ:
    "За время заключения преступник осознал неотвратимость наказания и раскаялся в содеянном."
    
    РЕКОМЕНДАЦИЯ:
    Провести повторную цифровую реабилитацию через 3 месяца.
    
    ПОДПИСЬ: ___________________
    
    ДЕЛО ЗАКРЫТО
    
    ..........................
    
    >>> НАЖМИТЕ В ЛЮБОМ МЕСТЕ ДЛЯ ВОЗВРАТА НА ГЛАВНУЮ <<<
  `;

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center overflow-hidden bg-white cursor-pointer"
      onClick={() => window.location.href = "/"}
    >
      <div 
        className="text-gray-800 text-2xl whitespace-pre-line font-mono text-center transition-all duration-1000 opacity-80 max-w-3xl"
        style={{ 
          transform: `translateY(${creditsPosition}vh)`,
          fontFamily: "'Press Start 2P', monospace",
          letterSpacing: '0.1em',
          lineHeight: '1.8em',
        }}
      >
        {creditsText}
      </div>
    </div>
  );
};

export default PrisonCredits;
