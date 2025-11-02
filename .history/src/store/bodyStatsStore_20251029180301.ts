import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { BodyStat } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

interface BodyStatsStore {
  bodyStats: BodyStat[];
  addBodyStat: (stat: Omit<BodyStat, 'id' | 'createdAt'>) => void;
  deleteBodyStat: (id: string) => void;
  updateBodyStat: (id: string, updates: Partial<BodyStat>) => void;
  getLatestWeight: () => number | undefined;
  getWeightTrend: () => 'up' | 'down' | 'stable';
  loadBodyStats: () => void;
}

export const useBodyStatsStore = create<BodyStatsStore>((set, get) => ({
  bodyStats: [],

  addBodyStat: (statData) => {
    const newStat: BodyStat = {
      ...statData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    const updatedStats = [...get().bodyStats, newStat];
    set({ bodyStats: updatedStats });
    saveToStorage(STORAGE_KEYS.BODY_STATS, updatedStats);
  },

  deleteBodyStat: (id) => {
    const updatedStats = get().bodyStats.filter(stat => stat.id !== id);
    set({ bodyStats: updatedStats });
    saveToStorage(STORAGE_KEYS.BODY_STATS, updatedStats);
  },

  updateBodyStat: (id, updates) => {
    const updatedStats = get().bodyStats.map(stat =>
      stat.id === id ? { ...stat, ...updates } : stat
    );
    set({ bodyStats: updatedStats });
    saveToStorage(STORAGE_KEYS.BODY_STATS, updatedStats);
  },

  getLatestWeight: () => {
    const stats = get().bodyStats
      .filter(stat => stat.weight)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return stats[0]?.weight;
  },

  getWeightTrend: () => {
    const stats = get().bodyStats
      .filter(stat => stat.weight)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);
    
    if (stats.length < 2) return 'stable';
    
    const [latest, previous] = stats;
    const diff = latest.weight! - previous.weight!;
    
    if (Math.abs(diff) < 0.5) return 'stable';
    return diff > 0 ? 'up' : 'down';
  },

  loadBodyStats: () => {
    const storedStats = loadFromStorage(STORAGE_KEYS.BODY_STATS);
    if (storedStats) {
      set({ bodyStats: storedStats });
    }
  },
}));