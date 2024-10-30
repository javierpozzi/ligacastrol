import React from 'react';
import { Trophy, Users, MapPin, Database } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { addTeam, addLeague, addLocation, generateLeagueFixtures } = useStore();

  const populateDemoData = () => {
    // Add teams
    const teamNames = [
      'Red Dragons', 'Blue Eagles', 'Green Lions', 'Yellow Tigers', 
      'Black Panthers', 'White Hawks', 'Purple Knights', 'Orange Warriors',
      'Silver Wolves', 'Golden Bears', 'Bronze Bulls', 'Platinum Phoenix',
      'Crystal Cobras', 'Ruby Raptors', 'Sapphire Sharks', 'Emerald Eagles',
      'Diamond Dragons', 'Pearl Pirates', 'Jade Jaguars', 'Amber Arrows'
    ];

    const teams = teamNames.map(name => ({
      name,
      logo: `https://source.unsplash.com/100x100/?${name.toLowerCase().split(' ')[1]},sport`,
    }));

    const teamIds = teams.map(team => {
      const { id } = addTeam(team);
      return id;
    });

    // Add leagues
    const leagueNames = ['Premier Division', 'Championship', 'Elite League'];
    const teamsPerLeague = Math.floor(teamIds.length / leagueNames.length);
    
    let currentTeamIndex = 0;
    leagueNames.forEach(name => {
      const leagueTeams = teamIds.slice(
        currentTeamIndex,
        currentTeamIndex + teamsPerLeague
      );
      const { id } = addLeague({ name, teams: leagueTeams });
      generateLeagueFixtures(id);
      currentTeamIndex += teamsPerLeague;
    });

    // Add locations
    const locations = [
      { name: 'Central Stadium', address: '123 Main Street, Downtown' },
      { name: 'Sports Complex Arena', address: '456 Athletic Drive, Sportstown' },
      { name: 'Victory Field', address: '789 Championship Road, Winnersville' },
      { name: 'Unity Park Stadium', address: '321 Community Blvd, Unitycity' },
      { name: 'Elite Center', address: '654 Pro Avenue, Eliteville' }
    ];

    locations.forEach(location => {
      addLocation(location);
    });

    toast.success('Demo data populated successfully!');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Trophy className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Liga Castrol</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setActiveTab('leagues')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'leagues'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leagues
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'teams'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Teams
              </button>
              <button
                onClick={() => setActiveTab('locations')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'locations'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Locations
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={populateDemoData}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              <Database className="h-4 w-4 mr-2" />
              Demo Data
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}