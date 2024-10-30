import { useState } from "react";
import toast from "react-hot-toast";
import { RepositoryFactory } from "../../repositories/factory";
import { useTeams } from "../../hooks/useTeams";

interface TeamFormProps {
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    logo: string;
  };
}

export function TeamForm({ onClose, initialData }: TeamFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [logo, setLogo] = useState(initialData?.logo ?? "");
  const { reloadTeams } = useTeams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const teamService = RepositoryFactory.getTeamService();

      if (initialData) {
        await teamService.updateTeam(initialData.id, { name, logo });
        toast.success("Team updated successfully");
      } else {
        await teamService.createTeam({ name, logo });
        toast.success("Team created successfully");
      }

      reloadTeams();
      onClose();
    } catch (error) {
      toast.error(initialData ? "Failed to update team" : "Failed to create team");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Team Name
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
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          id="logo"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
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
