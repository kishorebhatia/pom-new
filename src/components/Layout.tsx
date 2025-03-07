import { Outlet, NavLink } from 'react-router-dom';
import { FiHome, FiUpload, FiSearch, FiCode, FiEye, FiDownload } from 'react-icons/fi';

const Layout = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: <FiHome className="w-5 h-5" /> },
    { to: '/upload', label: 'Upload PRD', icon: <FiUpload className="w-5 h-5" /> },
    { to: '/analyze', label: 'Analyze', icon: <FiSearch className="w-5 h-5" /> },
    { to: '/generate', label: 'Generate', icon: <FiCode className="w-5 h-5" /> },
    { to: '/preview', label: 'Preview', icon: <FiEye className="w-5 h-5" /> },
    { to: '/export', label: 'Export', icon: <FiDownload className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary-600">PRD App Builder</h1>
        </div>
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.to} className="mb-1">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-gray-700 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                        : 'hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              PRD App Builder
            </h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 