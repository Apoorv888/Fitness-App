import React from 'react';
import { useBodyStatsStore } from '../store/bodyStatsStore';
import type { BodyStat } from '../types';

interface Props {
  onEdit?: (s: BodyStat) => void;
}

export const BodyStatsList: React.FC<Props> = ({ onEdit }) => {
  const { bodyStats, deleteBodyStat } = useBodyStatsStore();
  const items = bodyStats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (items.length === 0) return <div className="card text-center py-8">No body stats yet</div>;

  return (
    <div className="space-y-4">
      {items.map(s => (
        <div key={s.id} className="card flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {s.photoPath && <img src={s.photoPath} alt="body" className="w-16 h-16 object-cover rounded-md" />}
            <div>
              <div className="font-semibold">{s.date}</div>
              <div className="text-sm text-gray-600">{s.weight ? `${s.weight} kg` : ''} {s.bodyFat ? `• ${s.bodyFat}%` : ''}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && <button onClick={() => onEdit(s)} className="text-blue-600">Edit</button>}
            <button onClick={() => { if (confirm('Delete measurement?')) deleteBodyStat(s.id); }} className="text-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};
