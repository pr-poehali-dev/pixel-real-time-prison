
import { useEffect, useState } from "react";

const PrisonCell = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`w-full h-full absolute inset-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Пиксельный фон тюрьмы */}
      <div className="absolute inset-0 bg-gray-800 bg-opacity-90 z-0" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        imageRendering: 'pixelated'
      }}></div>
      
      {/* Пиксельные стены тюрьмы */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="border-8 border-gray-700" style={{ 
          width: "90%", 
          height: "80%", 
          backgroundImage: "linear-gradient(to right, #4b5563 1px, transparent 1px), linear-gradient(to bottom, #4b5563 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          imageRendering: "pixelated"
        }}></div>
      </div>
      
      {/* Пиксельная решетка */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
        <div className="relative w-full max-w-3xl h-3/4" style={{ imageRendering: 'pixelated' }}>
          {Array(10).fill(0).map((_, idx) => (
            <div 
              key={`bar-${idx}`} 
              className="absolute top-0 bottom-0 w-3 bg-gray-600 border border-gray-700" 
              style={{ left: `${idx * 11}%`, boxShadow: "inset 2px 0 0 rgba(0,0,0,0.3)" }}
            ></div>
          ))}
          
          {Array(5).fill(0).map((_, idx) => (
            <div 
              key={`h-bar-${idx}`} 
              className="absolute left-0 right-0 h-3 bg-gray-600 border border-gray-700" 
              style={{ top: `${idx * 25}%`, boxShadow: "inset 0 2px 0 rgba(0,0,0,0.3)" }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrisonCell;
