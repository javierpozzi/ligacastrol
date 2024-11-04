import { Edit2, PlusCircle, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTeams } from "../../hooks/useTeams";
import { RepositoryFactory } from "../../repositories/factory";
import { Modal } from "../shared/Modal";
import { TeamForm } from "./TeamForm";
import { useNavigate } from 'react-router-dom';
import { Team } from "../../types";

export function TeamList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const { teams, loading, error, reloadTeams } = useTeams();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleDelete = async (teamId: string) => {
    try {
      const teamService = RepositoryFactory.getTeamService();
      await teamService.deleteTeam(teamId);
      reloadTeams();
      toast.success("Team deleted successfully");
    } catch {
      toast.error("Failed to delete team");
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Team
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div 
            key={team.id} 
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex items-center space-x-4">
              <img src={team.logo} alt={team.name} className="w-16 h-16 rounded-full" />
              <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => navigate(`/teams/${team.id}`)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <Eye className="w-4 h-4" />
              </button>

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

      {/* <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTeam ? "Edit Team" : "Add Team"}>
        <TeamForm onClose={handleCloseModal} initialData={editingTeam ?? undefined} />
      </Modal> */}
    </div>
  );
}