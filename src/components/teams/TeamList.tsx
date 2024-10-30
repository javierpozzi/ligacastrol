import React, { useState } from 'react';
import { Edit2, PlusCircle, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTeams } from '../../hooks/useTeams';
import { TeamForm } from './TeamForm';
import { Modal } from '../shared/Modal';
import { RepositoryFactory } from '../../repositories/factory';
import { TeamService } from '../../services/team-service';
import { Team } from '../../types';

export function TeamList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { teams, loading, error, reloadTeams } = useTeams();

  const teamService = new TeamService(RepositoryFactory.getTeamRepository());

  const handleDelete = async (teamId: string) => {
    try {
      await teamService.deleteTeam(teamId);
      reloadTeams();
      toast.success('Team deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete team');
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No teams</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map(team => (
            <div
              key={team.id}
              className="relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={team.logo}
                    alt={team.name}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(team)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTeam ? 'Edit Team' : 'Create Team'}
      >
        <TeamForm
          onClose={handleCloseModal}
          initialData={editingTeam ?? undefined}
        />
      </Modal>
    </div>
  );
}