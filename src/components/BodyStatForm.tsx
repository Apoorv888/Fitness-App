import React, { useState, useRef } from 'react';
import type { BodyStat } from '../types';
import { useBodyStatsStore } from '../store/bodyStatsStore';
import { resizeImage } from '../utils/image';

interface Props {
  onClose?: () => void;
  edit?: BodyStat | null;
}

export const BodyStatForm: React.FC<Props> = ({ onClose, edit }) => {
  const isEdit = !!edit;
  const [date, setDate] = useState(edit?.date ?? new Date().toISOString().slice(0,10));
  const [weight, setWeight] = useState<number | ''>(edit?.weight ?? '');
  const [bodyFat, setBodyFat] = useState<number | ''>(edit?.bodyFat ?? '');
  const [notes, setNotes] = useState(edit?.notes ?? '');
  const [photoData, setPhotoData] = useState<string | undefined>(edit?.photoPath);

  const { addBodyStat, updateBodyStat } = useBodyStatsStore();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const onFile = async (f?: File) => {
    const file = f || fileRef.current?.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file, 1024, 0.8);
      setPhotoData(resized);
    } catch (e) {
      // fallback to direct read
      const reader = new FileReader();
      reader.onload = () => setPhotoData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submit = () => {
    const payload = {
      date,
      weight: weight === '' ? undefined : Number(weight),
      bodyFat: bodyFat === '' ? undefined : Number(bodyFat),
      notes,
      photoPath: photoData,
    } as Omit<BodyStat, 'id' | 'createdAt'>;

    if (isEdit && edit) {
      updateBodyStat(edit.id, payload);
    } else {
      addBodyStat(payload);
    }
    onClose?.();
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit' : 'Add'} Measurement</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Weight (kg)</label>
          <input type="number" step="0.1" value={weight as any} onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))} className="input-field" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Body Fat (%)</label>
          <input type="number" step="0.1" value={bodyFat as any} onChange={e => setBodyFat(e.target.value === '' ? '' : Number(e.target.value))} className="input-field" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Photo</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={() => onFile()} />
          {photoData && <img src={photoData} alt="preview" className="mt-2 max-w-xs rounded-md shadow-sm" />}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};
