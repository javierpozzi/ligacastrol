import React, { useState } from 'react';
import { Edit2, PlusCircle, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocations } from '../../hooks/useLocations';
import { LocationForm } from './LocationForm';
import { Modal } from '../shared/Modal';
import { RepositoryFactory } from '../../repositories/factory';
import { LocationService } from '../../services/location-service';
import { Location } from '../../types';

export function LocationList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const { locations, loading, error, reloadLocations } = useLocations();

  const locationService = new LocationService(RepositoryFactory.getLocationRepository());

  const handleDelete = async (locationId: string) => {
    try {
      await locationService.deleteLocation(locationId);
      reloadLocations();
      toast.success('Location deleted successfully');
    } catch (err) {
      toast.error('Failed to delete location');
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Locations</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Location
        </button>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No locations</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new location.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map(location => (
            <div
              key={location.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{location.address}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(location)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingLocation ? 'Edit Location' : 'Create New Location'}
      >
        <LocationForm onClose={handleCloseModal} initialData={editingLocation ?? undefined} />
      </Modal>
    </div>
  );
}