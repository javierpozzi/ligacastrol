import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { League } from "../../types";
import { RepositoryFactory } from "../../repositories/factory";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export function PublicLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLeagues = async () => {
      try {
        const leagueService = RepositoryFactory.getLeagueService();
        const data = await leagueService.getAllLeagues();
        setLeagues(data.filter(league => league.isActive));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load leagues"));
      } finally {
        setLoading(false);
      }
    };

    loadLeagues();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Active Leagues</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {leagues.map((league) => (
            <li key={league.id}>
              <Link
                to={`/leagues/${league.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {league.name}
                    </h3>
                    <p className="text-sm text-gray-500">{league.year}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 