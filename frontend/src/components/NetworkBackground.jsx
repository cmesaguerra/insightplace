import React from 'react';

export const NetworkBackground = ({ className = '', showSymbol = false, enhanced = false }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BF0004" stopOpacity={enhanced ? "0.9" : "0.8"} />
            <stop offset="100%" stopColor="#BF0004" stopOpacity={enhanced ? "0.4" : "0.3"} />
          </radialGradient>
          <radialGradient id="symbolGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BF0004" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#BF0004" stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" stopOpacity={enhanced ? "0.6" : "0.3"} />
            <stop offset="50%" stopColor="#BF0004" stopOpacity={enhanced ? "0.3" : "0.1"} />
            <stop offset="100%" stopColor="#374151" stopOpacity={enhanced ? "0.6" : "0.3"} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Enhanced Connection Lines */}
        <g stroke={enhanced ? "url(#connectionGradient)" : "#374151"} 
           strokeWidth={enhanced ? "2" : "1"} 
           strokeOpacity={enhanced ? "1" : "0.3"}
           filter={enhanced ? "url(#glow)" : ""}>
          
          {/* Primary network layer */}
          <line x1="100" y1="150" x2="300" y2="200">
            {enhanced && <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />}
          </line>
          <line x1="300" y1="200" x2="500" y2="100">
            {enhanced && <animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="5s" repeatCount="indefinite" />}
          </line>
          <line x1="500" y1="100" x2="700" y2="180">
            {enhanced && <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />}
          </line>
          <line x1="700" y1="180" x2="900" y2="120">
            {enhanced && <animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="4.5s" repeatCount="indefinite" />}
          </line>
          <line x1="900" y1="120" x2="1100" y2="200">
            {enhanced && <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="6s" repeatCount="indefinite" />}
          </line>
          
          {/* Secondary network layer */}
          <line x1="150" y1="350" x2="350" y2="300">
            {enhanced && <animate attributeName="stroke-opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />}
          </line>
          <line x1="350" y1="300" x2="550" y2="380">
            {enhanced && <animate attributeName="stroke-opacity" values="0.9;0.5;0.9" dur="4s" repeatCount="indefinite" />}
          </line>
          <line x1="550" y1="380" x2="750" y2="320">
            {enhanced && <animate attributeName="stroke-opacity" values="0.5;0.9;0.5" dur="5s" repeatCount="indefinite" />}
          </line>
          <line x1="750" y1="320" x2="950" y2="400">
            {enhanced && <animate attributeName="stroke-opacity" values="0.9;0.5;0.9" dur="3.5s" repeatCount="indefinite" />}
          </line>
          
          {/* Tertiary network layer */}
          <line x1="200" y1="550" x2="400" y2="500">
            {enhanced && <animate attributeName="stroke-opacity" values="0.4;0.7;0.4" dur="6s" repeatCount="indefinite" />}
          </line>
          <line x1="400" y1="500" x2="600" y2="580">
            {enhanced && <animate attributeName="stroke-opacity" values="0.7;0.4;0.7" dur="4.5s" repeatCount="indefinite" />}
          </line>
          <line x1="600" y1="580" x2="800" y2="520">
            {enhanced && <animate attributeName="stroke-opacity" values="0.4;0.7;0.4" dur="5.5s" repeatCount="indefinite" />}
          </line>
          <line x1="800" y1="520" x2="1000" y2="600">
            {enhanced && <animate attributeName="stroke-opacity" values="0.7;0.4;0.7" dur="3s" repeatCount="indefinite" />}
          </line>
          
          {/* Vertical connections */}
          <line x1="300" y1="200" x2="350" y2="300">
            {enhanced && <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />}
          </line>
          <line x1="500" y1="100" x2="550" y2="380">
            {enhanced && <animate attributeName="stroke-opacity" values="0.6;0.2;0.6" dur="5s" repeatCount="indefinite" />}
          </line>
          <line x1="700" y1="180" x2="750" y2="320">
            {enhanced && <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" />}
          </line>
          <line x1="900" y1="120" x2="950" y2="400">
            {enhanced && <animate attributeName="stroke-opacity" values="0.6;0.2;0.6" dur="6s" repeatCount="indefinite" />}
          </line>
          
          {/* Cross connections */}
          <line x1="350" y1="300" x2="600" y2="580">
            {enhanced && <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur="7s" repeatCount="indefinite" />}
          </line>
          <line x1="550" y1="380" x2="800" y2="520">
            {enhanced && <animate attributeName="stroke-opacity" values="0.5;0.1;0.5" dur="5.5s" repeatCount="indefinite" />}
          </line>
          
          {/* Additional enhanced connections */}
          {enhanced && (
            <>
              <line x1="100" y1="150" x2="150" y2="350">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="8s" repeatCount="indefinite" />
              </line>
              <line x1="1100" y1="200" x2="1000" y2="600">
                <animate attributeName="stroke-opacity" values="0.4;0.1;0.4" dur="6s" repeatCount="indefinite" />
              </line>
              <line x1="500" y1="100" x2="950" y2="400">
                <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="9s" repeatCount="indefinite" />
              </line>
            </>
          )}
          
          {/* Additional connections for symbol integration */}
          {showSymbol && (
            <>
              <line x1="550" y1="380" x2="600" y2="400" />
              <line x1="600" y1="400" x2="650" y2="420" />
              <line x1="650" y1="420" x2="700" y2="400" />
              <line x1="700" y1="400" x2="750" y2="380" />
            </>
          )}
        </g>
        
        {/* Enhanced Network Nodes */}
        <g filter={enhanced ? "url(#glow)" : ""}>
          <circle cx="100" cy="150" r={enhanced ? "5" : "4"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="5;8;5" dur="4s" repeatCount="indefinite" />}
          </circle>
          <circle cx="300" cy="200" r={enhanced ? "7" : "6"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="7;10;7" dur="5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="500" cy="100" r={enhanced ? "6" : "5"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="6;9;6" dur="3.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="700" cy="180" r={enhanced ? "8" : "7"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="8;12;8" dur="6s" repeatCount="indefinite" />}
          </circle>
          <circle cx="900" cy="120" r={enhanced ? "5" : "4"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="5;8;5" dur="4.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="1100" cy="200" r={enhanced ? "6" : "5"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="6;9;6" dur="3s" repeatCount="indefinite" />}
          </circle>
          
          <circle cx="150" cy="350" r={enhanced ? "6" : "5"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="6;9;6" dur="5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="350" cy="300" r={enhanced ? "9" : "8"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="9;13;9" dur="4s" repeatCount="indefinite" />}
          </circle>
          <circle cx="550" cy="380" r={enhanced ? "7" : "6"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="7;11;7" dur="3.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="750" cy="320" r={enhanced ? "8" : "7"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="8;12;8" dur="6s" repeatCount="indefinite" />}
          </circle>
          <circle cx="950" cy="400" r={enhanced ? "6" : "5"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="6;10;6" dur="4.5s" repeatCount="indefinite" />}
          </circle>
          
          <circle cx="200" cy="550" r={enhanced ? "5" : "4"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="5;8;5" dur="5.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="400" cy="500" r={enhanced ? "7" : "6"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="7;11;7" dur="3s" repeatCount="indefinite" />}
          </circle>
          <circle cx="600" cy="580" r={enhanced ? "9" : "8"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="9;14;9" dur="4s" repeatCount="indefinite" />}
          </circle>
          <circle cx="800" cy="520" r={enhanced ? "6" : "5"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="6;10;6" dur="5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="1000" cy="600" r={enhanced ? "7" : "6"} fill="url(#nodeGradient)">
            {enhanced && <animate attributeName="r" values="7;11;7" dur="6s" repeatCount="indefinite" />}
          </circle>
          
          {/* Symbol-inspired nodes */}
          {showSymbol && (
            <>
              <circle cx="600" cy="400" r="10" fill="url(#symbolGradient)">
                {enhanced && <animate attributeName="r" values="10;15;10" dur="4s" repeatCount="indefinite" />}
              </circle>
              <circle cx="650" cy="420" r="8" fill="url(#nodeGradient)">
                {enhanced && <animate attributeName="r" values="8;12;8" dur="5s" repeatCount="indefinite" />}
              </circle>
              <circle cx="700" cy="400" r="6" fill="url(#nodeGradient)">
                {enhanced && <animate attributeName="r" values="6;10;6" dur="3.5s" repeatCount="indefinite" />}
              </circle>
            </>
          )}
        </g>
        
        {/* Enhanced animated pulse effects */}
        <g>
          <circle cx="600" cy="580" r="8" fill="none" stroke="#BF0004" strokeWidth={enhanced ? "3" : "2"} strokeOpacity="0.6">
            <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="300" r="8" fill="none" stroke="#BF0004" strokeWidth={enhanced ? "3" : "2"} strokeOpacity="0.4">
            <animate attributeName="r" values="8;25;8" dur="4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
          </circle>
          {enhanced && (
            <>
              <circle cx="700" cy="180" r="7" fill="none" stroke="#BF0004" strokeWidth="2" strokeOpacity="0.5">
                <animate attributeName="r" values="7;18;7" dur="5s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle cx="950" cy="400" r="5" fill="none" stroke="#BF0004" strokeWidth="2" strokeOpacity="0.3">
                <animate attributeName="r" values="5;15;5" dur="6s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="6s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          {showSymbol && (
            <circle cx="600" cy="400" r="10" fill="none" stroke="#BF0004" strokeWidth="3" strokeOpacity="0.8">
              <animate attributeName="r" values="10;30;10" dur="5s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.8;0.2;0.8" dur="5s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
        
        {/* Large symbol in the background */}
        {showSymbol && (
          <g transform="translate(900, 100)" opacity={enhanced ? "0.08" : "0.05"}>
            <rect x="0" y="0" width="50" height="150" rx="25" fill="#6b7280" />
            <polygon points="0,0 25,25 0,50" fill="#dc2626" transform="translate(-15, -25)" />
            <path d="M 60 50 Q 120 20, 120 80 Q 120 140, 60 110 Z" fill="#dc2626" />
          </g>
        )}
      </svg>
      
      {/* Enhanced floating elements */}
      {showSymbol && enhanced && (
        <>
          <div className="absolute top-20 right-20 opacity-15">
            <img src="/symbol.png" alt="" className="w-32 h-32 animate-pulse" />
          </div>
          <div className="absolute bottom-20 left-20 opacity-10">
            <img src="/symbol.png" alt="" className="w-24 h-24 animate-bounce" style={{animationDuration: '3s'}} />
          </div>
        </>
      )}
    </div>
  );
};