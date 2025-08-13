import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { NetworkingContact, InfoContact } from '../../types';
import { Info, Calendar, MessageSquare } from 'lucide-react';

export const InfoTab: React.FC = () => {
  const { currentUser } = useAuth();
  const [networkingContacts, setNetworkingContacts] = useState<NetworkingContact[]>([]);
  const [infoContacts, setInfoContacts] = useState<InfoContact[]>([]);
  const [formData, setFormData] = useState({
    networkingContactId: '',
    response: '' as 'A' | 'B' | 'C' | '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    
    // Load networking contacts (non-skipped)
    const networkingQuery = query(
      collection(db, 'networking'),
      where('userId', '==', currentUser.uid),
      where('isSkipped', '!=', true)
    );
    
    const networkingSnapshot = await getDocs(networkingQuery);
    const networkingData: NetworkingContact[] = [];
    networkingSnapshot.forEach((doc) => {
      networkingData.push({ id: doc.id, ...doc.data() } as NetworkingContact);
    });
    
    setNetworkingContacts(networkingData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Load info contacts
    const infoQuery = query(
      collection(db, 'info'),
      where('userId', '==', currentUser.uid)
    );
    
    const infoSnapshot = await getDocs(infoQuery);
    const infoData: InfoContact[] = [];
    infoSnapshot.forEach((doc) => {
      infoData.push({ id: doc.id, ...doc.data() } as InfoContact);
    });
    
    setInfoContacts(infoData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formData.networkingContactId) return;
    
    setLoading(true);
    try {
      const selectedContact = networkingContacts.find(c => c.id === formData.networkingContactId);
      
      const infoData = {
        networkingContactId: formData.networkingContactId,
        contactName: selectedContact?.name || '',
        response: formData.response,
        remarks: formData.remarks,
        date: formData.date,
        userId: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'info'), infoData);
      setFormData({
        networkingContactId: '',
        response: '' as 'A' | 'B' | 'C' | '',
        remarks: '',
        date: new Date().toISOString().split('T')[0]
      });
      await loadData();
    } catch (error) {
      console.error('Error adding info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'A': return 'text-green-400 bg-green-500/20';
      case 'B': return 'text-yellow-400 bg-yellow-500/20';
      case 'C': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Info className="w-6 h-6 mr-2 text-green-400" />
          Info
        </h2>
        <p className="text-gray-400">Gather information from your networking contacts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Info Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Add Info Record</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Contact</label>
              <select
                value={formData.networkingContactId}
                onChange={(e) => setFormData({ ...formData, networkingContactId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none"
                required
              >
                <option value="">Choose a contact from Networking...</option>
                {networkingContacts.map((contact) => (
                  <option key={contact.id} value={contact.id} className="bg-gray-800">
                    {contact.name} - {contact.date}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Response</label>
              <select
                value={formData.response}
                onChange={(e) => setFormData({ ...formData, response: e.target.value as 'A' | 'B' | 'C' })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none"
                required
              >
                <option value="">Select response...</option>
                <option value="A" className="bg-gray-800">A - Excellent</option>
                <option value="B" className="bg-gray-800">B - Good</option>
                <option value="C" className="bg-gray-800">C - Needs Improvement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none resize-none"
                placeholder="Information gathered, notes, feedback..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Info Record'}
            </button>
          </form>
        </div>

        {/* Info Records List */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Info Records</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {infoContacts.map((info) => (
              <div
                key={info.id}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{info.contactName}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getResponseColor(info.response)}`}>
                      {info.response}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {info.date}
                    </span>
                  </div>
                </div>
                
                {info.remarks && (
                  <div className="flex items-start">
                    <MessageSquare className="w-3 h-3 mr-1 mt-1 text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-400">{info.remarks}</p>
                  </div>
                )}
              </div>
            ))}
            
            {infoContacts.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No info records added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};