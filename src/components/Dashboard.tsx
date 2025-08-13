import React, { useState } from 'react';
import { Sidebar } from './Layout/Sidebar';
import { Header } from './Layout/Header';
import { ProfileModal } from './Profile/ProfileModal';
import { NetworkingTab } from './Tabs/NetworkingTab';
import { InfoTab } from './Tabs/InfoTab';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('networking');
  const [showProfile, setShowProfile] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'networking':
        return <NetworkingTab />;
      case 'info':
        return <InfoTab />;
      case 'reinfo':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Reinfo</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      case 'prospecting':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Prospecting</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      case 'invi':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Invi</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      case 'plan':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Plan</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      case 'closing':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Closing</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      case 'view':
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">View Analytics</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      default:
        return <NetworkingTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header onProfileClick={() => setShowProfile(true)} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-auto">
          {renderActiveTab()}
        </main>
      </div>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
};