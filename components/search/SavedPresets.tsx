'use client';

import { Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SavedPreset {
  id: number;
  name: string;
  filters: Record<string, any>;
}

interface SavedPresetsProps {
  presets: SavedPreset[];
  onLoadPreset: (preset: SavedPreset) => void;
  onDeletePreset: (id: number) => void;
  onSavePreset: (name: string, filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
  isOpen: boolean;
}

export function SavedPresets({
  presets,
  onLoadPreset,
  onDeletePreset,
  onSavePreset,
  currentFilters,
  isOpen,
}: SavedPresetsProps) {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetName, setPresetName] = useState('');

  if (!isOpen) return null;

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName, currentFilters);
      setPresetName('');
      setShowSaveForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg" data-testid="presets-panel">
      <h3 className="font-semibold mb-4">Saved Filter Presets</h3>

      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
          >
            <button
              onClick={() => onLoadPreset(preset)}
              data-testid={`preset-${preset.name}`}
              className="text-sm font-medium text-left flex-1 hover:text-blue-600"
            >
              {preset.name}
            </button>
            <button
              onClick={() => onDeletePreset(preset.id)}
              data-testid={`delete-preset-${preset.id}`}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showSaveForm ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Preset name..."
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            data-testid="preset-name-input"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSavePreset}
              data-testid="confirm-save-preset"
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveForm(false)}
              className="flex-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowSaveForm(true)}
          data-testid="save-preset-btn"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          Save Current Filters
        </button>
      )}
    </div>
  );
}
