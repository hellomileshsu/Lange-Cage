
import React from 'react';
import { CharacterVariant } from '../types';

interface CharacterSpriteProps {
  variant: CharacterVariant;
  className?: string;
  width?: number;
  height?: number;
  isTalking?: boolean;
  isMoving?: boolean;
  idleVariant?: 'breath' | 'bounce' | 'sway';
  delay?: number; // Animation delay in seconds
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({ 
    variant, 
    className = "", 
    width = 40, 
    height = 40,
    isTalking = false,
    isMoving = false,
    idleVariant = 'breath',
    delay = 0
}) => {
    // --- Palette ---
    const SKIN = "#ffdbac";
    const SKIN_SHADOW = "#e0ac69";
    const HAIR_BROWN = "#5d4037";
    const HAIR_BLACK = "#1a1a1a";
    const HAIR_BLONDE = "#fcd34d";
    const HAIR_HIGHLIGHT = "rgba(255,255,255,0.2)";
    
    // Animation Styles for Container
    let containerStyle: React.CSSProperties = {
        transformOrigin: 'bottom center',
        animationDelay: `${delay}s`
    };

    if (isTalking) {
        containerStyle = { ...containerStyle, animation: 'talk-bounce 0.2s infinite alternate' };
    } else if (isMoving) {
        // No container animation for walking
    } else {
        switch (idleVariant) {
            case 'bounce':
                containerStyle = { ...containerStyle, animation: `idle-bounce 0.5s ease-in-out` };
                break;
            case 'sway':
                containerStyle = { ...containerStyle, animation: `idle-sway 1s ease-in-out` };
                break;
            case 'breath':
            default:
                containerStyle = { ...containerStyle, animation: `idle-breath 2s infinite ease-in-out ${delay}s` };
                break;
        }
    }

    const getLegStyle = (delay: string) => isMoving ? {
        animation: `leg-cycle 0.5s infinite ease-in-out ${delay}`,
    } : {};

    const renderContent = () => {
        if (variant === 'barista') {
            return (
                <>
                    {/* Legs & Shoes */}
                    <rect x="5" y="13" width="2" height="3" fill="#1e293b" style={getLegStyle('0s')} />
                    <rect x="9" y="13" width="2" height="3" fill="#1e293b" style={getLegStyle('-0.25s')} />
                    
                    {/* Body - White Shirt with Rolled Sleeves */}
                    <rect x="4" y="7" width="8" height="6" fill="#f8fafc" />
                    <rect x="3" y="8" width="2" height="2" fill="#f8fafc" /> {/* Left Rolled Sleeve */}
                    <rect x="11" y="8" width="2" height="2" fill="#f8fafc" /> {/* Right Rolled Sleeve */}
                    
                    {/* Apron Detail */}
                    <rect x="5" y="8" width="6" height="5.5" fill="#065f46" />
                    <rect x="4" y="8" width="8" height="0.5" fill="#1a1a1a" /> {/* Neck strap */}
                    <rect x="5.5" y="9" width="1.5" height="1" fill="#f59e0b" /> {/* Name badge */}
                    <rect x="9" y="11" width="1.5" height="2.5" fill="#f1f5f9" opacity="0.9" /> {/* Side towel */}
                    <rect x="9" y="11" width="1.5" height="0.5" fill="#cbd5e1" /> {/* Towel fold */}
                    
                    {/* Head */}
                    <rect x="4" y="2" width="8" height="4" fill={HAIR_BROWN} />
                    <rect x="4" y="2" width="8" height="1" fill={HAIR_HIGHLIGHT} />
                    <rect x="5" y="3" width="6" height="4" fill={SKIN} />
                    <rect x="6" y="5" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="5" width="1" height="1" fill="#1a1a1a" />
                </>
            );
        }
        if (variant === 'nomad') {
            return (
                <>
                    {/* Satchel / Laptop Bag */}
                    <path d="M4 7 L12 12" stroke="#1a1a1a" strokeWidth="0.8" />
                    <rect x="11" y="9" width="3" height="4" fill="#1e293b" rx="0.5" />
                    <rect x="11.5" y="10" width="2" height="0.5" fill="#64748b" /> {/* Bag buckle */}

                    {/* Legs */}
                    <rect x="5" y="13" width="2" height="3" fill="#334155" style={getLegStyle('0s')} />
                    <rect x="9" y="13" width="2" height="3" fill="#334155" style={getLegStyle('-0.25s')} />

                    {/* Body - Detailed Hoodie */}
                    <rect x="4" y="7" width="8" height="6" fill="#475569" />
                    <rect x="7.5" y="8" width="1" height="5" fill="#1e293b" opacity="0.3" /> {/* Zip line */}
                    {/* Hoodie Strings */}
                    <rect x="6.5" y="7.5" width="0.5" height="2" fill="#e2e8f0" />
                    <rect x="9.0" y="7.5" width="0.5" height="2" fill="#e2e8f0" />
                    {/* Wi-Fi Pin */}
                    <circle cx="5" cy="8.5" r="0.4" fill="#60a5fa" />

                    {/* Head */}
                    <rect x="4" y="2" width="8" height="5" fill={HAIR_BLACK} />
                    <rect x="5" y="3.5" width="6" height="4" fill={SKIN} />
                    {/* Blue Reflection Glasses */}
                    <rect x="5" y="4.5" width="2.2" height="1.2" fill="#0ea5e9" opacity="0.6" stroke="#000" strokeWidth="0.2" />
                    <rect x="8.8" y="4.5" width="2.2" height="1.2" fill="#0ea5e9" opacity="0.6" stroke="#000" strokeWidth="0.2" />
                    <rect x="7.2" y="5.1" width="1.6" height="0.3" fill="#000" />
                </>
            );
        }
        if (variant === 'student') {
            return (
                <>
                    {/* Legs & Plaid Skirt */}
                    <rect x="5" y="13" width="2" height="3" fill="#334155" style={getLegStyle('0s')} />
                    <rect x="9" y="13" width="2" height="3" fill="#334155" style={getLegStyle('-0.25s')} />
                    
                    {/* Skirt */}
                    <rect x="4" y="11" width="8" height="2.5" fill="#7f1d1d" /> 
                    <rect x="4" y="11" width="8" height="2.5" fill="url(#plaidPattern)" opacity="0.4" />

                    {/* Body - School Blazer */}
                    <rect x="4" y="7.5" width="8" height="4" fill="#1e3a8a" />
                    <path d="M6 7.5 L8 8.5 L10 7.5" fill="#f8fafc" /> {/* White Collar */}
                    <rect x="10" y="8.5" width="0.8" height="0.8" fill="#fcd34d" /> {/* Tiny Badge */}
                    
                    {/* Backpack */}
                    <rect x="4" y="8" width="1" height="4" fill="#be123c" />
                    <rect x="11" y="8" width="1" height="4" fill="#be123c" />

                    {/* Head */}
                    <defs>
                        <pattern id="plaidPattern" width="2" height="2" patternUnits="userSpaceOnUse">
                            <rect width="1" height="2" fill="#000" />
                            <rect width="2" height="1" fill="#000" />
                        </pattern>
                    </defs>
                    <circle cx="8" cy="4" r="4" fill={HAIR_BLONDE} />
                    <rect x="10" y="1" width="2.5" height="2.5" fill="#e11d48" rx="0.5" /> {/* Bow */}
                    <rect x="5" y="4.5" width="6" height="3" fill={SKIN} />
                    <rect x="6" y="5.5" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="5.5" width="1" height="1" fill="#1a1a1a" />
                </>
            );
        }
        if (variant === 'traveler') {
            return (
                <>
                    {/* Legs & Cargo Shorts */}
                    <rect x="5" y="13" width="2" height="3" fill="#d97706" style={getLegStyle('0s')} />
                    <rect x="9" y="13" width="2" height="3" fill="#d97706" style={getLegStyle('-0.25s')} />
                    {/* Cargo pockets */}
                    <rect x="4.5" y="13" width="1" height="1.5" fill="#b45309" style={getLegStyle('0s')} />
                    <rect x="10.5" y="13" width="1" height="1.5" fill="#b45309" style={getLegStyle('-0.25s')} />

                    {/* Body - Multi-pocket Vest */}
                    <rect x="4" y="7" width="8" height="6" fill="#1d4ed8" />
                    <rect x="4.5" y="8.5" width="2" height="2" fill="#1e40af" /> {/* Vest pocket L */}
                    <rect x="9.5" y="8.5" width="2" height="2" fill="#1e40af" /> {/* Vest pocket R */}
                    
                    {/* Detailed Camera */}
                    <rect x="11" y="9.5" width="3.5" height="2.5" fill="#1a1a1a" rx="0.5" />
                    <circle cx="12.7" cy="10.7" r="0.8" fill="#334155" /> {/* Lens */}
                    <rect x="13.5" y="9.5" width="1" height="0.5" fill="#fcd34d" /> {/* Flash */}
                    
                    {/* Head + Bucket Hat */}
                    <rect x="4" y="3.5" width="8" height="3.5" fill={SKIN} />
                    <rect x="3" y="2.5" width="10" height="1.5" fill="#fef3c7" /> {/* Hat brim */}
                    <rect x="5" y="1" width="6" height="1.5" fill="#fef3c7" /> {/* Hat top */}
                    <rect x="5" y="1.8" width="6" height="0.4" fill="#d97706" /> {/* Hat band */}
                    <rect x="6" y="4.5" width="1" height="1" fill="#1a1a1a" />
                    <rect x="9" y="4.5" width="1" height="1" fill="#1a1a1a" />
                </>
            );
        }
        // Player - Cafe Owner Refinement
        return (
            <>
                {/* Legs & Polished Shoes */}
                <rect x="5" y="13" width="2" height="3" fill="#2d1a12" style={getLegStyle('0s')} />
                <rect x="9" y="13" width="2" height="3" fill="#2d1a12" style={getLegStyle('-0.25s')} />
                <rect x="4.5" y="15" width="3" height="1" fill="#000" style={getLegStyle('0s')} />
                <rect x="8.5" y="15" width="3" height="1" fill="#000" style={getLegStyle('-0.25s')} />

                {/* Body - Owner Luxury Attire */}
                <rect x="4" y="7" width="8" height="6" fill="#f8fafc" /> {/* White Shirt */}
                {/* Waistcoat with texture */}
                <rect x="5" y="7" width="6" height="6" fill="#451a03" /> 
                <rect x="5" y="7" width="6" height="0.5" fill="#78350f" opacity="0.3" /> {/* Shoulder stitch */}
                
                {/* Pocket Watch Chain */}
                <path d="M8.5 9.5 Q 9.5 10.5 10.5 9.5" fill="none" stroke="#fcd34d" strokeWidth="0.4" />
                
                {/* Cufflinks */}
                <circle cx="4.2" cy="12" r="0.4" fill="#f8fafc" />
                <circle cx="11.8" cy="12" r="0.4" fill="#f8fafc" />

                <rect x="7" y="7" width="2" height="1.2" fill="#000" /> {/* Bow Tie */}
                
                {/* Head - Groomed Hair */}
                <path d="M4 2.5 Q 4 1 8 1 Q 12 1 12 2.5 L12 6 L4 6 Z" fill={HAIR_BLACK} />
                <rect x="10.5" y="2.5" width="1" height="1" fill={HAIR_HIGHLIGHT} />
                <rect x="5" y="3.5" width="6" height="4" fill={SKIN} />
                <rect x="6" y="5.2" width="1" height="1" fill="#1a1a1a" />
                <rect x="9" y="5.2" width="1" height="1" fill="#1a1a1a" />
            </>
        );
    };

    return (
        <>
            <style>
                {`
                @keyframes talk-bounce {
                    0% { transform: scaleY(1); }
                    100% { transform: scaleY(1.05) translateY(-2%); }
                }
                @keyframes leg-cycle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-2.5px); }
                }
                @keyframes idle-breath {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.04); }
                }
                @keyframes idle-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes idle-sway {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(4deg); }
                    75% { transform: rotate(-4deg); }
                }
                `}
            </style>
            <svg 
                width={width} 
                height={height} 
                viewBox="0 0 16 16" 
                className={`drop-shadow-md ${className}`}
                style={containerStyle}
            >
                {renderContent()}
            </svg>
        </>
    );
};

export default CharacterSprite;
