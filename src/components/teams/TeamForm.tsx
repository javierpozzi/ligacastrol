import React, { useState } from 'react';
import { useStore } from '../../store';
import { PlusCircle } from 'lucide-react';

interface TeamFormProps {
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    logo: string;
  };
}

export function TeamForm({ onClose, initialData }: TeamFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [logo, setLogo] = useState(initialData?.logo ?? '');
  const addTeam = useStore(state => state.addTeam);
  const updateTeam = useStore(state => state.updateTeam);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && logo.trim()) {
      if (initialData) {
        updateTeam(initialData.id, { name, logo });
      } else {
        addTeam({ name, logo });
      }
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Team Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="Manchester United"
          required
        />
      </div>
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          id="logo"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="https://example.com/logo.png"
          required
        />
      </div>
      {logo && (
        <div className="mt-2">
          <img
            src={logo}
            alt="Logo preview"
            className="w-16 h-16 object-contain rounded-full border border-gray-200"
          />
        </div>
      )}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {initialData ? 'Update Team' : 'Create Team'}
        </button>
      </div>
    </form>
  );
}