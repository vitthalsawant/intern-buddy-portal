import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, User, Trophy, BarChart3, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
  };

  if (!user) return null;

  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-foreground">Intern Portal</h1>
          
          <div className="flex space-x-4">
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                size="sm"
                className="transition-all hover-scale"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            
            <Link to="/leaderboard">
              <Button 
                variant={isActive('/leaderboard') ? 'default' : 'ghost'} 
                size="sm"
                className="transition-all hover-scale"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button 
                variant={isActive('/profile') ? 'default' : 'ghost'} 
                size="sm"
                className="transition-all hover-scale"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="transition-all hover-scale"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="transition-all hover-scale"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}