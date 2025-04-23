
const PrisonBackground = () => {
  return (
    <>
      {/* Пиксельный фон тюрьмы */}
      <div className="absolute inset-0 bg-gray-800 bg-opacity-90 z-0" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        imageRendering: 'pixelated'
      }}></div>
      
      {/* Пиксельные решетки на фоне */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ 
        backgroundImage: `
          repeating-linear-gradient(to right, transparent, transparent 20px, #4b5563 20px, #4b5563 25px),
          repeating-linear-gradient(to bottom, transparent, transparent 20px, #4b5563 20px, #4b5563 25px)
        `,
        backgroundSize: "100px 100px",
        imageRendering: "pixelated"
      }}></div>
    </>
  );
};

export default PrisonBackground;
