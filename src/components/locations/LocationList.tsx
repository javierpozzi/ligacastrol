import React, { useState } from 'react';
import { useStore } from '../../store';
import { MapPin, Edit2, Trash2, PlusCircle } from 'lucide-react';
import { LocationForm } from './LocationForm';
import { Modal } from '../shared/Modal';
import toast from 'react-hot-toast';

export function LocationList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<null | { id: string; name: string; address: string }>(null);
  const { locations, matches, deleteLocation } = useStore();

  const handleDelete = (locationId: string) => {
    const locationInUse = matches.some(match => match.locationId === locationId);
    if (locationInUse) {
      toast.error('Cannot delete location as it is assigned to one or more matches');
      return;
    }
    deleteLocation(locationId);
    toast.success('Location deleted successfully');
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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