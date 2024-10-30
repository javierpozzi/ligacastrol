import { ArrowLeft, Calendar, Edit2, PlusCircle, Table, Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useStore } from "../../store";
import { Modal } from "../shared/Modal";
import { LeagueForm } from "./LeagueForm";
import { LeagueTable } from "./LeagueTable";
import { MatchWeeks } from "./MatchWeeks";

export function LeagueList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<null | { id: string; name: string; teams: string[] }>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"fixtures" | "table" | null>(null);
  const { leagues, matches, deleteLeague } = useStore();

  const handleDelete = (leagueId: string) => {
    const leagueHasMatches = matches.some((match) => match.leagueId === leagueId);
    if (leagueHasMatches) {
      toast.error("Cannot delete league as it has scheduled matches");
      return;
    }
    deleteLeague(leagueId);
    toast.success("League deleted successfully");
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
    setSelectedView("fixtures");
  };

  const handleViewTable = (leagueId: string) => {
    setSelectedLeague(leagueId);
    setSelectedView("table");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ligas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Crear Liga
        </button>
      </div>

      {leagues.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sin ligas</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva liga.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedLeague ? (
            selectedView === "table" ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      setSelectedLeague(null);
                      setSelectedView(null);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {leagues.find((l) => l.id === selectedLeague)?.name} - Table
                  </h2>
                </div>
                <LeagueTable leagueId={selectedLeague} />
              </div>
            ) : (
              <MatchWeeks
                leagueId={selectedLeague}
                onBack={() => {
                  setSelectedLeague(null);
                  setSelectedView(null);
                }}
              />
            )
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {leagues.map((league) => (
                <div key={league.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{league.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{league.teams.length} teams</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewTable(league.id)}
                          className="p-2 text-gray-400 hover:text-gray-500"
                          title="View Table"
                        >
                          <Table className="w-4 h-4" />
                        </button>
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
                          title="Edit League"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(league.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                          title="Delete League"
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
        title={editingLeague ? "Edit League" : "Create New League"}
      >
        <LeagueForm onClose={handleCloseModal} initialData={editingLeague ?? undefined} />
      </Modal>
    </div>
  );
}
