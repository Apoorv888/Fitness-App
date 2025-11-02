import React, { useState } from 'react';
import { useBodyStatsStore } from '../store/bodyStatsStore';

export const PhotoCompare: React.FC = () => {
  const { bodyStats } = useBodyStatsStore();
  const photos = bodyStats.filter(s => s.photoPath).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [left, setLeft] = useState<string | undefined>(photos[0]?.photoPath);
  const [right, setRight] = useState<string | undefined>(photos[1]?.photoPath ?? photos[0]?.photoPath);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Photo Compare</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div>
          <label className="text-sm text-gray-600">Left</label>
          <select className="input-field" value={left} onChange={e => setLeft(e.target.value)}>
            {photos.map(p => <option key={p.id} value={p.photoPath}>{p.date}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Right</label>
          <select className="input-field" value={right} onChange={e => setRight(e.target.value)}>
            {photos.map(p => <option key={p.id} value={p.photoPath}>{p.date}</option>)}
          </select>
        </div>

        <div className="text-sm text-gray-500">Select two photos to compare side-by-side.</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="border p-2">
          {left ? <img src={left} alt="left" className="w-full object-contain" /> : <div className="text-center text-gray-500 py-8">No photo</div>}
        </div>
        <div className="border p-2">
          {right ? <img src={right} alt="right" className="w-full object-contain" /> : <div className="text-center text-gray-500 py-8">No photo</div>}
        </div>
      </div>
    </div>
  );
};
