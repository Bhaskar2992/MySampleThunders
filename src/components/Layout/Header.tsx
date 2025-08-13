import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const { userProfile, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 shadow-lg border-b border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {userProfile?.name || 'User'}!
          </h1>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onProfileClick}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>
          
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};