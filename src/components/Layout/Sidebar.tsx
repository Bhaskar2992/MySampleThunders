import React from 'react';
import { Users, Info, RefreshCw, Target, Calendar, TrendingUp, Eye } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'networking', label: 'Networking', icon: Users, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { id: 'info', label: 'Info', icon: Info, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  { id: 'reinfo', label: 'Reinfo', icon: RefreshCw, color: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { id: 'prospecting', label: 'Prospecting', icon: Target, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'invi', label: 'Invi', icon: Calendar, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
  { id: 'plan', label: 'Plan', icon: TrendingUp, color: 'bg-gradient-to-r from-indigo-500 to-blue-500' },
  { id: 'closing', label: 'Closing', icon: Eye, color: 'bg-gradient-to-r from-teal-500 to-cyan-500' },
  { id: 'view', label: 'View', icon: Eye, color: 'bg-gradient-to-r from-gray-600 to-gray-800' }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-64 bg-gray-900 shadow-xl border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Activity
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 transform hover:scale-105 ${
                isActive 
                  ? `${tab.color} text-white shadow-lg` 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};