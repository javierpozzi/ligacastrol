import { Calendar, Edit2, PlusCircle, Trash2, Trophy, Database } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLeagues } from "../../hooks/useLeagues";
import { RepositoryFactory } from "../../repositories/factory";
import { Modal } from "../shared/Modal";
import { LeagueForm } from "./LeagueForm";
import { useNavigate } from 'react-router-dom';
import { usePopulateDemoData } from "../../hooks/usePopulateDemoData";

export default function LeagueList() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<null | {
    id: string;
    name: string;
    year: number;
    isActive: boolean;
  }>(null);

  const { leagues, loading, error, reloadLeagues } = useLeagues();
  const populateDemoData = usePopulateDemoData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleDelete = async (leagueId: string) => {
    try {
      const leagueService = RepositoryFactory.getLeagueService();
      await leagueService.deleteLeague(leagueId);
      reloadLeagues();
      toast.success("League deleted successfully");
    } catch {
      toast.error("Failed to delete league");
    }
  };

  const handleEdit = (league: { id: string; name: string; year: number; isActive: boolean }) => {
    setEditingLeague(league);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLeague(null);
  };

  const handleViewStandings = (leagueId: string) => {
    navigate(`/league/${leagueId}/standings`);
  };

  const handleViewFixtures = (leagueId: string) => {
    navigate(`/league/${leagueId}`);
  };

  const handleLoadDemoData = async () => {
    try {
      await populateDemoData();
      reloadLeagues();
    } catch (error) {
      console.error(error);
      toast.error("Failed to load demo data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Leagues</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleLoadDemoData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Database className="w-4 h-4 mr-2" />
            Load Demo Data
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create League
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => (
          <div key={league.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">{league.name}</h3>
            <p className="mt-1 text-sm text-gray-500">Year: {league.year}</p>
            <p className="mt-1 text-sm text-gray-500">Status: {league.isActive ? "Active" : "Inactive"}</p>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleViewStandings(league.id)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Standings
              </button>

              <button
                onClick={() => handleViewFixtures(league.id)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Fixtures
              </button>

              <button
                onClick={() => handleEdit(league)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(league.id)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingLeague ? "Edit League" : "Create League"}>
        <LeagueForm onClose={handleCloseModal} initialData={editingLeague ?? undefined} />
      </Modal>
    </div>
  );
}
