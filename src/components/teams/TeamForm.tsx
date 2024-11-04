import { useState } from "react";
import { Team } from "../../types";

interface TeamFormProps {
  initialData?: Team;
  onSubmit: (data: Omit<Team, "id">) => Promise<void>;
  onCancel: () => void;
}

export function TeamForm({ initialData, onSubmit, onCancel }: TeamFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [logo, setLogo] = useState(initialData?.logo ?? "");
  const [preferences, setPreferences] = useState(initialData?.preferences ?? {
    preferredLocationIds: [],
    preferredStartHour: 9,
    preferredEndHour: 21,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      logo,
      preferences,
    });
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
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Hours</label>
        <div className="mt-1 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startHour" className="block text-xs text-gray-500">
              Start Hour
            </label>
            <input
              type="number"
              id="startHour"
              min={0}
              max={23}
              value={preferences.preferredStartHour}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  preferredStartHour: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endHour" className="block text-xs text-gray-500">
              End Hour
            </label>
            <input
              type="number"
              id="endHour"
              min={0}
              max={23}
              value={preferences.preferredEndHour}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  preferredEndHour: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
