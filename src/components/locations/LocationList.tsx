import React, { useState } from 'react';
import { Edit2, PlusCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocations } from '../../hooks/useLocations';
import { LocationForm } from './LocationForm';
import { Modal } from '../shared/Modal';
import { RepositoryFactory } from '../../repositories/factory';

export function LocationList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<null | {
    id: string;
    name: string;
    address: string;
  }>(null);

  const { locations, loading, error, reloadLocations } = useLocations();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleDelete = async (locationId: string) => {
    try {
      const locationService = RepositoryFactory.getLocationService();
      await locationService.deleteLocation(locationId);
      reloadLocations();
      toast.success('Location deleted successfully');
    } catch {
      toast.error('Failed to delete location');
    }
  };

  const handleEdit = (location: { id: string; name: string; address: string }) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Locations</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <div key={location.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{location.address}</p>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(location)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(location.id)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingLocation ? "Edit Location" : "Add Location"}>
        <LocationForm onClose={handleCloseModal} initialData={editingLocation ?? undefined} />
      </Modal>
    </div>
  );
}