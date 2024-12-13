import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { toggleTheme, toggleSidebar } from '../../lib/store/slices/uiSlice';
import { RootState } from '../../lib/store';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="z-40 py-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6">
            <input
              className="w-full pl-8 pr-2 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
              type="text"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle color mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </li>
          <li className="relative">
            <button className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
            </button>
          </li>
          <li className="relative">
            <button className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none">
              <img
                className="object-cover w-8 h-8 rounded-full"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                alt="User avatar"
              />
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;