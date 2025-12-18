import React from 'react';

interface PlayerStatsHUDProps {
  xp: number;
  level: number;
}

const PlayerStatsHUD: React.FC<PlayerStatsHUDProps> = ({ xp, level }) => {
  // Level up every 50 XP
  const xpForNextLevel = 50;
  const currentLevelXp = xp % xpForNextLevel;
  const progressPercent = (currentLevelXp / xpForNextLevel) * 100;

  return (
    <div className="absolute top-4 left-4 z-30 pointer-events-none animate-fade-in">
      <div className="bg-gray-900/90 border-2 border-yellow-500 rounded-lg p-3 shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-3 min-w-[200px]">
        {/* Level Badge */}
        <div className="flex flex-col items-center justify-center bg-yellow-500 text-black w-12 h-12 rounded shadow-inner border border-yellow-300">
          <span className="text-[8px] font-bold uppercase leading-none mt-1">LVL</span>
          <span className="text-xl font-pixel font-bold leading-none">{level}</span>
        </div>

        {/* Info & Bar */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <h3 className="text-yellow-400 font-bold text-xs font-pixel">ENGLISH XP</h3>
            <span className="text-gray-400 text-[10px] font-mono">{currentLevelXp}/{xpForNextLevel}</span>
          </div>
          
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsHUD;