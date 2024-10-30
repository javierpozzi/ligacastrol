import React, { useState } from 'react';
import { useStore } from '../../store';
import { Users, Edit2, Trash2, PlusCircle } from 'lucide-react';
import { TeamForm } from './TeamForm';
import { Modal } from '../shared/Modal';
import toast from 'react-hot-toast';

export function TeamList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<null | { id: string; name: string; logo: string }>(null);
  const { teams, leagues, deleteTeam } = useStore();

  const handleDelete = (teamId: string) => {
    const teamInUse = leagues.some(league => league.teams.includes(teamId));
    if (teamInUse) {
      toast.error('Cannot delete team as it belongs to one or more leagues');
      return;
    }
    deleteTeam(teamId);
    toast.success('Team deleted successfully');
  };

  const handleEdit = (team: { id: string; name: string; logo: string }) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Crear Equipo
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sin equipos</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo equipo.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map(team => (
            <div
              key={team.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="w-16 h-16 rounded-full object-contain bg-gray-50"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="mr-2">Stats:</span>
                      <span className="font-medium">{team.played}</span> P |
                      <span className="font-medium ml-1">{team.points}</span> Pts
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
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
        title={editingTeam ? 'Edit Team' : 'Create New Team'}
      >
        <TeamForm onClose={handleCloseModal} initialData={editingTeam ?? undefined} />
      </Modal>
    </div>
  );
}