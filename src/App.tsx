import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LeagueList } from './components/leagues/LeagueList';
import { TeamList } from './components/teams/TeamList';
import { LocationList } from './components/locations/LocationList';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('leagues');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'leagues' && <LeagueList />}
        {activeTab === 'teams' && <TeamList />}
        {activeTab === 'locations' && <LocationList />}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}