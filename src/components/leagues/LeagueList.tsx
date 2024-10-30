import React, { useState } from 'react';
import { useStore } from '../../store';
import { Trophy, Edit2, Trash2, PlusCircle, Calendar } from 'lucide-react';
import { LeagueForm } from './LeagueForm';
import { Modal } from '../shared/Modal';
import { MatchWeeks } from './MatchWeeks';
import toast from 'react-hot-toast';

export function LeagueList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<null | { id: string; name: string; teams: string[] }>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const { leagues, matches, deleteLeague } = useStore();

  const handleDelete = (leagueId: string) => {
    const leagueHasMatches = matches.some(match => match.leagueId === leagueId);
    if (leagueHasMatches) {
      toast.error('Cannot delete league as it has scheduled matches');
      return;
    }
    deleteLeague(leagueId);
    toast.success('League deleted successfully');
  };

  const handleEdit = (league: { id: string; name: string; teams: string[] }) => {
    setEditingLeague(league);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLeague(null);
  };

  const handleManageFixtures = (leagueId: string) => {
    setSelectedLeague(leagueId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Leagues</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create League
        </button>
      </div>

      {leagues.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leagues</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new league.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedLeague ? (
            <MatchWeeks 
              leagueId={selectedLeague} 
              onBack={() => setSelectedLeague(null)} 
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leagues.map(league => (
                <div
                  key={league.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{league.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {league.teams.length} teams
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleManageFixtures(league.id)}
                          className="p-2 text-gray-400 hover:text-gray-500"
                          title="Manage Fixtures"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(league)}
                          className="p-2 text-gray-400 hover:text-gray-500"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(league.id)}
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
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingLeague ? 'Edit League' : 'Create New League'}
      >
        <LeagueForm onClose={handleCloseModal} initialData={editingLeague ?? undefined} />
      </Modal>
    </div>
  );
}