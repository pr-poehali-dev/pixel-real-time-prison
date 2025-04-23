
import { useEffect, useState } from "react";

const PrisonCredits = () => {
  const [creditsPosition, setCreditsPosition] = useState(100);
  
  // Непонятный текст для субтитров
  const randomText = `
    XNSPK&71 RELEASE-v2.11a
    
    ..Error-code: 3355-PRSN-01
    ..Initialized system restore
    
    &%$##@!*(%^&*)_+=-098765432
    DATALEAK: 453.221.664.97
    PRISON.SYS_OVERRIDE=TRUE
    
    PRISONER STATUS: RELEASED
    AUTH_TOKEN: 7FF3-AC91-BEE2
    
    ВЫ ОТБЫЛИ СВОЙ СРОК
    
    SYSTEM-LOG:
    > Initializing memory flush...
    > Purging records...
    > Recalibrating neural patterns...
    > Memory integrity check: PASSED
    
    PRISONER.WIPE_PROTOCOL=ACTIVE
    RESET_COUNTDOWN: 00:00:13
    
    ПОСЛЕДНИЕ СЛОВА ЗАКЛЮЧЕННОГО:
    "Я не помню, за что я здесь оказался..."
    
    CASE-FILE: REDACTED
    CRIME: REDACTED
    SENTENCE: SERVED
    
    [END OF TRANSMISSION]
    
    ..............
    ..............
    ..............
    
    SYSTEM SHUTDOWN IMMINENT
  `;

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

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div 
        className="text-gray-800 text-2xl whitespace-pre-line font-mono text-center transition-all duration-1000 opacity-70"
        style={{ 
          transform: `translateY(${creditsPosition}vh)`,
          fontFamily: "'Press Start 2P', monospace",
          letterSpacing: '0.1em',
          lineHeight: '2em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {randomText}
      </div>
    </div>
  );
};

export default PrisonCredits;
