import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { authService } from '../../lib/services/authService';
import { 
  Home,
  Building2,
  Users,
  Wrench,
  FileText,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { logout } from '../../lib/store/slices/authSlice';
import { RootState } from '../../lib/store';

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    authService.logout()
      .then(() => {
        dispatch(logout());
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Properties', icon: Building2, href: '/properties' },
    { name: 'Tenants', icon: Users, href: '/tenants' },
    { name: 'Maintenance', icon: Wrench, href: '/maintenance' },
    { name: 'Documents', icon: FileText, href: '/documents' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className={`z-30 flex-shrink-0 w-64 overflow-y-auto bg-white dark:bg-gray-800 lg:block ${sidebarOpen ? '' : 'hidden'}`}>
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <div className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200">
          PropertyPro
        </div>
        <ul className="mt-6">
          {navigation.map((item) => (
            <li className="relative px-6 py-3" key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) => `inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                  isActive ? 'text-purple-600 dark:text-purple-400' : ''
                }`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                        aria-hidden="true"
                      ></span>
                    )}
                    <item.icon className="w-5 h-5" />
                    <span className="ml-4">{item.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="px-6 my-6">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            <span>Logout</span>
            <LogOut className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;