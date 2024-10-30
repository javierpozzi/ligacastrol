import React, { useState } from 'react';
import { Trophy, Users, MapPin, Database, X, Menu } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import { Match } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    addTeam, 
    addLeague,
    addLocation,
    addTeamToLeague,
    generateLeagueFixtures, 
    updateMatch,
    clearStore
  } = useStore();

  const populateDemoData = () => {
    // Clear existing data first
    clearStore();

    // Add locations first
    const locations = [
      { name: 'Estadio Santiago Bernabéu', address: 'Av. de Concha Espina, 1, Madrid' },
      { name: 'Camp Nou', address: 'C. d\'Arístides Maillol, 12, Barcelona' },
      { name: 'Estadio Metropolitano', address: 'Av. de Luis Aragonés, 4, Madrid' },
      { name: 'Estadio Ramón Sánchez Pizjuán', address: 'C. Sevilla Fútbol Club, Sevilla' },
      { name: 'Estadio de Mestalla', address: 'Av. de Suècia, València' }
    ];

    const locationIds = locations.map(location => {
      const { id } = addLocation(location);
      return id;
    });

    // Split teams into divisions
    const primeraTeams = [
      'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia',
      'Villarreal', 'Athletic Bilbao', 'Real Sociedad', 'Real Betis', 'Getafe',
      'Osasuna', 'Granada', 'Levante', 'Celta Vigo', 'Alaves',
      'Espanyol', 'Mallorca', 'Cadiz', 'Elche', 'Rayo Vallecano'
    ];

    const segundaTeams = [
      'Real Zaragoza', 'Sporting Gijon', 'Real Oviedo', 'Racing Santander', 'Tenerife',
      'Las Palmas', 'Malaga', 'Albacete', 'Burgos CF', 'Cartagena',
      'Eibar', 'Leganes', 'Mirandes', 'Ponferradina', 'Real Valladolid',
      'SD Huesca', 'Alcorcon', 'Fuenlabrada', 'Lugo', 'Almeria'
    ];

    // Create teams and store IDs by division
    const primeraTeamIds = primeraTeams.map(name => {
      const { id } = addTeam({
        name,
        logo: `https://source.unsplash.com/100x100/?${name.toLowerCase().split(' ')[0]},football`,
      });
      return id;
    });

    const segundaTeamIds = segundaTeams.map(name => {
      const { id } = addTeam({
        name,
        logo: `https://source.unsplash.com/100x100/?${name.toLowerCase().split(' ')[0]},football`,
      });
      return id;
    });

    // Add leagues with specific team distributions
    const leagueConfigs = [
      { name: 'Primera División', year: 2024, teamIds: primeraTeamIds, playedWeeks: 38, isActive: true },
      { name: 'Primera División', year: 2023, teamIds: primeraTeamIds, playedWeeks: 38, isActive: false },
      { name: 'Segunda División', year: 2024, teamIds: segundaTeamIds, playedWeeks: 19, isActive: true },
      { name: 'Segunda División', year: 2023, teamIds: segundaTeamIds, playedWeeks: 38, isActive: false },
    ];
    
    leagueConfigs.forEach(({ name, year, teamIds, playedWeeks, isActive }) => {
      // Add league
      const { id: leagueId } = addLeague({ 
        name, 
        year,
        isActive
      });

      // Add teams to league
      teamIds.forEach(teamId => {
        addTeamToLeague(leagueId, teamId);
      });
      
      // Generate fixtures first
      generateLeagueFixtures(leagueId);
      
      // Then get the updated matches from the store
      const leagueMatches = useStore.getState().matches.filter(m => m.leagueId === leagueId);

      // Add played matches for specified weeks
      if (playedWeeks > 0) {
        for (let week = 1; week <= playedWeeks; week++) {
          const weekMatches = leagueMatches.filter(m => m.weekNumber === week);
          weekMatches.forEach(match => {
            const homeScore = Math.floor(Math.random() * 5);
            const awayScore = Math.floor(Math.random() * 5);
            const randomLocationId = locationIds[Math.floor(Math.random() * locationIds.length)];
            const matchDate = new Date(year, 7 + Math.floor(week / 4), 1 + (week % 4) * 7);
            matchDate.setHours(Math.random() > 0.5 ? 16 : 20);
            
            updateMatch(match.id, {
              homeScore,
              awayScore,
              status: 'completed',
              locationId: randomLocationId,
              date: matchDate.toISOString()
            });
          });
        }
      }
    });

    toast.success('Demo data loaded successfully');
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
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <button
                onClick={() => setActiveTab('leagues')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'leagues'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Ligas
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
                Equipos
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
                Ubicaciones
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Demo data button */}
          <div className="hidden md:flex md:items-center">
            <button
              onClick={populateDemoData}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              <Database className="h-4 w-4 mr-2" />
              Datos Demo
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={() => {
              setActiveTab('leagues');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-base font-medium ${
              activeTab === 'leagues'
                ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'
            }`}
          >
            <Trophy className="h-5 w-5 mr-3" />
            Ligas
          </button>
          <button
            onClick={() => {
              setActiveTab('teams');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-base font-medium ${
              activeTab === 'teams'
                ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Equipos
          </button>
          <button
            onClick={() => {
              setActiveTab('locations');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-base font-medium ${
              activeTab === 'locations'
                ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'
            }`}
          >
            <MapPin className="h-5 w-5 mr-3" />
            Ubicaciones
          </button>
          <button
            onClick={() => {
              populateDemoData();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
          >
            <Database className="h-5 w-5 mr-3" />
            Datos Demo
          </button>
        </div>
      </div>
    </nav>
  );
}