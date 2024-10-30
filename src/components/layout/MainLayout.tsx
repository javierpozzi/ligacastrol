import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function MainLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 
              className="text-xl font-bold text-green-600 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Liga Castrol
            </h1>
            <nav className="flex space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                Leagues
              </button>
              <button 
                onClick={() => navigate('/teams')}
                className="text-gray-600 hover:text-gray-900"
              >
                Teams
              </button>
              <button 
                onClick={() => navigate('/locations')}
                className="text-gray-600 hover:text-gray-900"
              >
                Locations
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Liga Castrol. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 