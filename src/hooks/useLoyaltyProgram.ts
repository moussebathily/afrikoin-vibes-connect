import { LoyaltyProgram } from '@/types/monetization';

export const useLoyaltyProgram = () => {
  const calculateLevelProgression = (currentPoints: number, currentLevel: string) => {
    let newLevel = currentLevel;
    let nextLevelPoints = 500;
    
    // Level progression logic
    if (currentPoints >= 500 && currentLevel === 'Bronze') {
      newLevel = 'Silver';
      nextLevelPoints = 1500;
    } else if (currentPoints >= 1500 && currentLevel === 'Silver') {
      newLevel = 'Gold';
      nextLevelPoints = 5000;
    } else if (currentPoints >= 5000 && currentLevel === 'Gold') {
      newLevel = 'Platinum';
      nextLevelPoints = 10000;
    }
    
    return { newLevel, nextLevelPoints };
  };

  const addLoyaltyPoints = (currentProgram: LoyaltyProgram, points: number): LoyaltyProgram => {
    const newPoints = currentProgram.points + points;
    const { newLevel, nextLevelPoints } = calculateLevelProgression(newPoints, currentProgram.level);
    
    return {
      ...currentProgram,
      points: newPoints,
      level: newLevel,
      nextLevelPoints
    };
  };

  return { addLoyaltyPoints, calculateLevelProgression };
};