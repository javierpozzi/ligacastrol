import { createBrowserRouter } from 'react-router-dom';
import LeagueList from '../components/leagues/LeagueList';
import { MatchWeeks } from '../components/leagues/MatchWeeks';
import MatchEditor from '../components/leagues/MatchEditor';
import { MainLayout } from '../components/layout/MainLayout';
import { LeagueTable } from '../components/leagues/LeagueTable';
import { TeamList } from '../components/teams/TeamList';
import { LocationList } from '../components/locations/LocationList';
import { NotFound } from '../components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <LeagueList />,
      },
      {
        path: '/teams',
        element: <TeamList />,
      },
      {
        path: '/locations',
        element: <LocationList />,
      },
      {
        path: '/league/:leagueId',
        element: <MatchWeeks />,
      },
      {
        path: '/league/:leagueId/match/:matchId',
        element: <MatchEditor />,
      },
      {
        path: '/league/:leagueId/standings',
        element: <LeagueTable />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]); 