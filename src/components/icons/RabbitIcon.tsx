import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

/**
 * Rabbit SVG icon component
 * Uses SVG for smaller bundle size and better scalability
 */
export const RabbitIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Rabbit body */}
      <ellipse cx="12" cy="16" rx="6" ry="4"/>
      
      {/* Rabbit head */}
      <circle cx="12" cy="9" r="4.5"/>
      
      {/* Rabbit ears */}
      <ellipse cx="9.5" cy="6" rx="1.5" ry="4" style={{ opacity: 0.8 }} transform="rotate(-15 9.5 6)"/>
      <ellipse cx="14.5" cy="6" rx="1.5" ry="4" style={{ opacity: 0.8 }} transform="rotate(15 14.5 6)"/>
      
      {/* Inner ears */}
      <ellipse cx="9.5" cy="6.5" rx="0.8" ry="2.5" fill="rgba(255,255,255,0.3)" transform="rotate(-15 9.5 6.5)"/>
      <ellipse cx="14.5" cy="6.5" rx="0.8" ry="2.5" fill="rgba(255,255,255,0.3)" transform="rotate(15 14.5 6.5)"/>
      
      {/* Rabbit eyes */}
      <circle cx="10.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.7)"/>
      <circle cx="13.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.7)"/>
      
      {/* Eye highlights */}
      <circle cx="10.8" cy="8.2" r="0.3" fill="white"/>
      <circle cx="13.8" cy="8.2" r="0.3" fill="white"/>
      
      {/* Rabbit nose */}
      <path d="M12 10.5 L11.5 11 L12.5 11 Z"/>
      
      {/* Rabbit tail */}
      <circle cx="18" cy="16" r="1.5"/>
    </SvgIcon>
  );
};

export default RabbitIcon;