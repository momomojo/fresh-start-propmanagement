import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleTheme, toggleSidebar } from '@/lib/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    document.documentElement.classList.toggle('dark');
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Property Management</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="h-9 w-9"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">{user.name}</span>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {user.name[0].toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
