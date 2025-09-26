import React from 'react';

export const NetworkBackground = ({ className = '' }) => {
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
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        
        {/* Connection Lines */}
        <g stroke="#374151" strokeWidth="1" strokeOpacity="0.3">
          <line x1="100" y1="150" x2="300" y2="200" />
          <line x1="300" y1="200" x2="500" y2="100" />
          <line x1="500" y1="100" x2="700" y2="180" />
          <line x1="700" y1="180" x2="900" y2="120" />
          <line x1="900" y1="120" x2="1100" y2="200" />
          
          <line x1="150" y1="350" x2="350" y2="300" />
          <line x1="350" y1="300" x2="550" y2="380" />
          <line x1="550" y1="380" x2="750" y2="320" />
          <line x1="750" y1="320" x2="950" y2="400" />
          
          <line x1="200" y1="550" x2="400" y2="500" />
          <line x1="400" y1="500" x2="600" y2="580" />
          <line x1="600" y1="580" x2="800" y2="520" />
          <line x1="800" y1="520" x2="1000" y2="600" />
          
          {/* Vertical connections */}
          <line x1="300" y1="200" x2="350" y2="300" />
          <line x1="500" y1="100" x2="550" y2="380" />
          <line x1="700" y1="180" x2="750" y2="320" />
          <line x1="900" y1="120" x2="950" y2="400" />
          
          {/* Cross connections */}
          <line x1="350" y1="300" x2="600" y2="580" />
          <line x1="550" y1="380" x2="800" y2="520" />
        </g>
        
        {/* Network Nodes */}
        <g>
          <circle cx="100" cy="150" r="4" fill="url(#nodeGradient)" />
          <circle cx="300" cy="200" r="6" fill="url(#nodeGradient)" />
          <circle cx="500" cy="100" r="5" fill="url(#nodeGradient)" />
          <circle cx="700" cy="180" r="7" fill="url(#nodeGradient)" />
          <circle cx="900" cy="120" r="4" fill="url(#nodeGradient)" />
          <circle cx="1100" cy="200" r="5" fill="url(#nodeGradient)" />
          
          <circle cx="150" cy="350" r="5" fill="url(#nodeGradient)" />
          <circle cx="350" cy="300" r="8" fill="url(#nodeGradient)" />
          <circle cx="550" cy="380" r="6" fill="url(#nodeGradient)" />
          <circle cx="750" cy="320" r="7" fill="url(#nodeGradient)" />
          <circle cx="950" cy="400" r="5" fill="url(#nodeGradient)" />
          
          <circle cx="200" cy="550" r="4" fill="url(#nodeGradient)" />
          <circle cx="400" cy="500" r="6" fill="url(#nodeGradient)" />
          <circle cx="600" cy="580" r="8" fill="url(#nodeGradient)" />
          <circle cx="800" cy="520" r="5" fill="url(#nodeGradient)" />
          <circle cx="1000" cy="600" r="6" fill="url(#nodeGradient)" />
        </g>
        
        {/* Animated pulse effect */}
        <g>
          <circle cx="600" cy="580" r="8" fill="none" stroke="#dc2626" strokeWidth="2" strokeOpacity="0.6">
            <animate attributeName="r" values="8;16;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="300" r="8" fill="none" stroke="#dc2626" strokeWidth="2" strokeOpacity="0.4">
            <animate attributeName="r" values="8;20;8" dur="4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
};