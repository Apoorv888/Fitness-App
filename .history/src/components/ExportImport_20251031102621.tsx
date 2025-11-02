import React, { useRef } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const KEYS = [STORAGE_KEYS.MEALS, STORAGE_KEYS.WORKOUTS, STORAGE_KEYS.BODY_STATS, STORAGE_KEYS.USER_GOALS];

export const ExportImport: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const exportAll = () => {
    const out: any = {};
    for (const k of KEYS) {
      const v = localStorage.getItem(k);
      out[k] = v ? JSON.parse(v) : null;
    }
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittracker-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = () => {
    const f = fileRef.current?.files?.[0];
    if (!f) return alert('Select a JSON file to import');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        for (const k of KEYS) {
          if (parsed[k] !== undefined && parsed[k] !== null) {
            localStorage.setItem(k, JSON.stringify(parsed[k]));
          }
        }
        alert('Import complete. Reloading page to apply data.');
        window.location.reload();
      } catch (e) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(f);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Export / Import</h3>
      <div className="flex items-center space-x-3">
        <button onClick={exportAll} className="btn-primary">Export JSON</button>
        <input ref={fileRef} type="file" accept="application/json" />
        <button onClick={importFile} className="btn-secondary">Import JSON</button>
      </div>
      <p className="text-sm text-gray-500 mt-2">Use export to backup your data. Import will overwrite local data for stored keys.</p>
    </div>
  );
};
