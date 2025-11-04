import React, { useState, useEffect } from 'react';
import { BodyStatForm } from '../components/BodyStatForm';
import { BodyStatsList } from '../components/BodyStatsList';
import { BodyStatsChart } from '../components/BodyStatsChart';
import { PhotoCompare } from '../components/PhotoCompare';
import { useBodyStatsStore } from '../store/bodyStatsStore';

export const BodyStats: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const { loadBodyStats } = useBodyStatsStore();

  useEffect(() => {
    loadBodyStats();
  }, [loadBodyStats]);

  return (
  <div className="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Body Statistics</h1>
          <p className="text-gray-600 mt-2">Track your physical progress and measurements</p>
        </div>

        <div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">➕ Add Measurement</button>
        </div>
      </div>

  <div className="grid grid-cols-1 lg-grid-cols-3 gap-6">
  <div className="lg-col-span-2 space-y-6">
          <BodyStatsChart />
          <BodyStatsList onEdit={(s) => { setEditing(s); setShowForm(true); }} />
        </div>

        <div>
          <PhotoCompare />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <BodyStatForm edit={editing} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};