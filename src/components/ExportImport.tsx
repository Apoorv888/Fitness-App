import React, { useRef, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const KEYS = [STORAGE_KEYS.MEALS, STORAGE_KEYS.WORKOUTS, STORAGE_KEYS.BODY_STATS, STORAGE_KEYS.USER_GOALS];

export const ExportImport: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<Record<string, any> | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({});

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

  const onSelectFile = () => {
    const f = fileRef.current?.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const found: Record<string, any> = {};
        const sel: Record<string, boolean> = {};
        for (const k of KEYS) {
          if (parsed[k] !== undefined && parsed[k] !== null) {
            found[k] = parsed[k];
            sel[k] = true;
          }
        }
        setPreview(found);
        setSelectedKeys(sel);
      } catch (e) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(f);
  };

  const applyImport = () => {
    if (!preview) return alert('No import preview available');
    for (const k of Object.keys(selectedKeys)) {
      if (selectedKeys[k]) {
        localStorage.setItem(k, JSON.stringify(preview[k]));
      }
    }
    alert('Import applied. Reloading to apply data.');
    window.location.reload();
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Export / Import</h3>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <button onClick={exportAll} className="btn-primary">Export JSON</button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onSelectFile} />
        </div>

        {preview ? (
          <div>
            <div className="text-sm text-gray-600 mb-2">Import preview - select which keys to import:</div>
            <div className="space-y-2">
              {Object.keys(preview).map(k => (
                <label key={k} className="flex items-center space-x-2">
                  <input type="checkbox" checked={!!selectedKeys[k]} onChange={e => setSelectedKeys(s => ({ ...s, [k]: e.target.checked }))} />
                  <span className="text-sm">{k} — {Array.isArray(preview[k]) ? `${preview[k].length} entries` : typeof preview[k]}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2 mt-3">
              <button onClick={() => { setPreview(null); setSelectedKeys({}); if (fileRef.current) fileRef.current.value = ''; }} className="btn-secondary">Cancel</button>
              <button onClick={applyImport} className="btn-primary">Apply Selected</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Use export to backup your data. Import will overwrite local data for selected keys.</p>
        )}
      </div>
    </div>
  );
};
