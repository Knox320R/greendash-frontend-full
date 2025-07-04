
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient waves */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400/20 via-blue-500/20 to-purple-600/20 animate-pulse-slow"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-400/15 via-green-500/15 to-yellow-500/15 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute inset-0">
        {/* Large rotating circle */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-green-300/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        
        {/* Floating hexagon */}
        <div className="absolute bottom-1/3 left-1/6 w-32 h-32 border-2 border-blue-400/20 transform rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Moving triangle */}
        <div className="absolute top-1/2 left-3/4 w-0 h-0 border-l-16 border-r-16 border-b-28 border-l-transparent border-r-transparent border-b-purple-400/20 animate-bounce" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 10s linear infinite'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-green-400 rounded-full blur-sm animate-pulse opacity-60" style={{ animationDuration: '2s' }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-blue-400 rounded-full blur-sm animate-pulse opacity-60" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
      <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-pulse opacity-60" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default AnimatedBackground;
