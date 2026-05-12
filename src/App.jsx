import { useState } from 'react';
import { InventoryPage } from './pages/InventoryPage';
import { DashboardPage } from './pages/DashboardPage';
import { LayoutDashboard, List } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('inventory');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Global Navigation Topbar */}
      <nav className="bg-slate-900 text-white shadow-lg z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start h-12 gap-2">
            <button 
              onClick={() => setCurrentView('inventory')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${currentView === 'inventory' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <List className="w-4 h-4" />
              Inventario y Gestión
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${currentView === 'dashboard' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Analítico
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentView === 'inventory' ? <InventoryPage /> : <DashboardPage />}
      </div>
    </div>
  );
}

export default App;
