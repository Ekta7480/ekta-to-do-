import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Users, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StudentsPage from './StudentsPage';
import Overview from './Overview';

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '' },
    { icon: Users, label: 'Students', path: 'students' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
        <h1 className="text-xl font-semibold">Student Management</h1>
      </div>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg lg:shadow-none"
          >
            <div className="flex flex-col h-full">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => (
                  <motion.button
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              <div className="p-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} min-h-screen transition-all duration-300`}>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<StudentsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}