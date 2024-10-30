import { useState } from "react";
import toast from "react-hot-toast";
import { RepositoryFactory } from "../../repositories/factory";
import { useLocations } from "../../hooks/useLocations";

interface LocationFormProps {
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    address: string;
  };
}

export function LocationForm({ onClose, initialData }: LocationFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const { reloadLocations } = useLocations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const locationService = RepositoryFactory.getLocationService();

      if (initialData) {
        await locationService.updateLocation(initialData.id, { name, address });
        toast.success("Location updated successfully");
      } else {
        await locationService.createLocation({ name, address });
        toast.success("Location created successfully");
      }

      reloadLocations();
      onClose();
    } catch {
      toast.error(initialData ? "Failed to update location" : "Failed to create location");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Location Name
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
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
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