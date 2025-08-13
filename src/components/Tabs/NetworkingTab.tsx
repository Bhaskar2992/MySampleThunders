import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { NetworkingContact } from '../../types';
import { UserPlus, Calendar, MessageSquare, X } from 'lucide-react';

export const NetworkingTab: React.FC = () => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState<NetworkingContact[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipReason, setSkipReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [currentUser]);

  const loadContacts = async () => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'networking'),
      where('userId', '==', currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const contactsData: NetworkingContact[] = [];
    querySnapshot.forEach((doc) => {
      contactsData.push({ id: doc.id, ...doc.data() } as NetworkingContact);
    });
    
    setContacts(contactsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const contactData = {
        ...formData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'networking'), contactData);
      setFormData({
        name: '',
        details: '',
        remarks: '',
        date: new Date().toISOString().split('T')[0]
      });
      await loadContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!currentUser || !skipReason.trim()) return;
    
    setLoading(true);
    try {
      const skipData = {
        name: 'Skipped Contact',
        details: 'Contact was skipped',
        remarks: skipReason,
        date: new Date().toISOString().split('T')[0],
        userId: currentUser.uid,
        isSkipped: true,
        skipReason: skipReason,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'networking'), skipData);
      setShowSkipModal(false);
      setSkipReason('');
      await loadContacts();
    } catch (error) {
      console.error('Error adding skip record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <UserPlus className="w-6 h-6 mr-2 text-blue-400" />
          Networking
        </h2>
        <p className="text-gray-400">Add new contacts and build your network</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Contact Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Contact</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none"
                placeholder="Contact's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Details</label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none resize-none"
                placeholder="Contact details, position, company, etc."
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none resize-none"
                placeholder="Additional notes or remarks"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Contact'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowSkipModal(true)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Skip
              </button>
            </div>
          </form>
        </div>

        {/* Contacts List */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Contacts</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 rounded-lg border transition-colors ${
                  contact.isSkipped
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${contact.isSkipped ? 'text-red-300' : 'text-white'}`}>
                    {contact.name}
                  </h4>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {contact.date}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-2">{contact.details}</p>
                
                {contact.remarks && (
                  <div className="flex items-start">
                    <MessageSquare className="w-3 h-3 mr-1 mt-1 text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-400">{contact.remarks}</p>
                  </div>
                )}
                
                {contact.isSkipped && (
                  <div className="mt-2 text-xs text-red-300 bg-red-500/20 px-2 py-1 rounded">
                    Skipped: {contact.skipReason}
                  </div>
                )}
              </div>
            ))}
            
            {contacts.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No contacts added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skip Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Skip Contact</h3>
              <button
                onClick={() => setShowSkipModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Why are you skipping this contact?
              </label>
              <textarea
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 outline-none resize-none"
                placeholder="Provide a reason for skipping..."
                rows={3}
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSkipModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSkip}
                disabled={!skipReason.trim() || loading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Skipping...' : 'Skip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};