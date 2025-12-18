
import React, { useState } from 'react';
import { Mission } from '../types';

interface MissionHUDProps {
  missions: Mission[];
}

const MissionHUD: React.FC<MissionHUDProps> = ({ missions }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const completedCount = missions.filter(m => m.isCompleted).length;
  const progress = (completedCount / missions.length) * 100;

  return (
    <div className={`flex flex-col items-end transition-all duration-300 pointer-events-auto ${isCollapsed ? 'w-auto' : 'w-64 md:w-80'}`}>
      
      {/* Container with Toggle Logic */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/50 overflow-hidden text-gray-800 w-full transition-all duration-300">
        
        {/* Header (Click to Toggle) */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-700 p-3 flex justify-between items-center text-white hover:brightness-110 transition-all cursor-pointer outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs">{isCollapsed ? '📋' : '☕'}</span>
            <h3 className="font-bold font-pixel text-xs tracking-wider">
                {isCollapsed ? 'TASKS' : 'CAFE MISSIONS'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono">{completedCount}/{missions.length}</span>
            <span className={`text-[10px] transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}>
                ▼
            </span>
          </div>
        </button>
        
        {/* Content (Hidden when collapsed) */}
        {!isCollapsed && (
            <div className="animate-fade-in">
                {/* Progress Bar */}
                <div className="h-1 w-full bg-gray-200">
                    <div 
                        className="h-full bg-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Mission List */}
                <div className="p-3 space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
                    {missions.map((mission) => (
                    <div key={mission.id} className="flex items-start gap-2 group">
                        <div className={`mt-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
                            mission.isCompleted ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300 text-transparent group-hover:border-blue-400'
                        }`}>
                            ✓
                        </div>
                        <div className={`${mission.isCompleted ? 'opacity-40 line-through' : 'opacity-100'}`}>
                            <p className="text-xs font-bold leading-tight">{mission.title}</p>
                            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{mission.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MissionHUD;
