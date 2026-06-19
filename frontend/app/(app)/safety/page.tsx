'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AlertTriangle, Phone, Plus, Trash2, Shield, UserX, Flag, Search } from 'lucide-react';
import { safetyApi, usersApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getErrorMessage } from '@/lib/utils';
import { emitSOS } from '@/lib/socket';

const REPORT_REASONS = [
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'FAKE_PROFILE', label: 'Fake Profile' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
  { value: 'SCAM', label: 'Scam' },
  { value: 'OTHER', label: 'Other' },
];

export default function SafetyPage() {
  const queryClient = useQueryClient();
  const [showAddContact, setShowAddContact] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const [showReport, setShowReport] = useState(false);
  const [reportSearch, setReportSearch] = useState('');
  const [reportUser, setReportUser] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [reportData, setReportData] = useState({ reason: 'HARASSMENT', description: '' });

  const [showBlock, setShowBlock] = useState(false);
  const [blockSearch, setBlockSearch] = useState('');
  const [blockUser, setBlockUser] = useState<{ id: string; firstName: string; lastName: string } | null>(null);

  const { data: searchResults = [] } = useQuery({
    queryKey: ['user-search', reportSearch],
    queryFn: () => usersApi.search(reportSearch).then((r) => r.data),
    enabled: reportSearch.length >= 2,
  });

  const { data: blockSearchResults = [] } = useQuery({
    queryKey: ['user-search-block', blockSearch],
    queryFn: () => usersApi.search(blockSearch).then((r) => r.data),
    enabled: blockSearch.length >= 2,
  });

  const reportMutation = useMutation({
    mutationFn: () => safetyApi.reportUser({ reportedUserId: reportUser!.id, reason: reportData.reason, description: reportData.description }),
    onSuccess: () => {
      toast.success('Report submitted. Our team will review it.');
      setShowReport(false);
      setReportUser(null);
      setReportSearch('');
      setReportData({ reason: 'HARASSMENT', description: '' });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const blockMutation = useMutation({
    mutationFn: () => safetyApi.blockUser(blockUser!.id),
    onSuccess: () => {
      toast.success(`${blockUser!.firstName} has been blocked.`);
      setShowBlock(false);
      setBlockUser(null);
      setBlockSearch('');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['emergency-contacts'],
    queryFn: () => safetyApi.getEmergencyContacts().then((r) => r.data),
  });

  const addContactMutation = useMutation({
    mutationFn: () => safetyApi.addEmergencyContact(newContact),
    onSuccess: () => {
      toast.success('Emergency contact added!');
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      setShowAddContact(false);
      setNewContact({ name: '', phone: '', relationship: '' });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => safetyApi.deleteEmergencyContact(id),
    onSuccess: () => {
      toast.success('Contact removed');
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleSOS = () => {
    if (!sosActive) {
      setSosActive(true);
      setSosCountdown(5);
    }
  };

  useEffect(() => {
    if (!sosActive) return;

    if (sosCountdown === 0) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          safetyApi.triggerSOS({ lat, lng });
          emitSOS(lat, lng);
          toast('🚨 SOS alert sent to emergency contacts and JoinUp team!', {
            duration: 6000,
            style: { background: '#EF4444', color: '#fff' },
          });
        },
        () => {
          safetyApi.triggerSOS({ lat: 18.5204, lng: 73.8567 });
          toast('🚨 SOS alert sent (location unavailable)', { style: { background: '#EF4444', color: '#fff' } });
        },
      );
      setSosActive(false);
      return;
    }

    const t = setTimeout(() => setSosCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [sosActive, sosCountdown]);

  const cancelSOS = () => {
    setSosActive(false);
    setSosCountdown(5);
    toast.success('SOS cancelled');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-500" /> Safety Center
        </h1>
        <p className="text-gray-500 text-sm mt-1">Your safety tools and emergency features</p>
      </div>

      {/* SOS Button */}
      <div className="card p-6 text-center">
        <h2 className="font-semibold text-gray-900 mb-1">Emergency SOS</h2>
        <p className="text-sm text-gray-500 mb-6">Press and hold for 3 seconds to send an SOS alert with your location to emergency contacts.</p>

        {!sosActive ? (
          <button
            onMouseDown={handleSOS}
            onTouchStart={handleSOS}
            className="w-36 h-36 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white flex flex-col items-center justify-center mx-auto shadow-float hover:shadow-xl transition-all active:scale-95 cursor-pointer select-none"
          >
            <AlertTriangle className="w-10 h-10 mb-1" />
            <span className="font-bold text-lg">SOS</span>
            <span className="text-xs text-red-200">Hold to activate</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-36 h-36 rounded-full bg-red-500 text-white flex flex-col items-center justify-center mx-auto shadow-float animate-pulse-soft">
              <AlertTriangle className="w-10 h-10 mb-1" />
              <span className="font-bold text-4xl">{sosCountdown}</span>
              <span className="text-xs text-red-200">Sending in...</span>
            </div>
            <Button variant="secondary" onClick={cancelSOS}>Cancel SOS</Button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">SOS will send your GPS location to your emergency contacts and the JoinUp safety team.</p>
      </div>

      {/* Emergency Contacts */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary-500" /> Emergency Contacts
          </h2>
          {contacts.length < 3 && (
            <Button variant="secondary" size="sm" onClick={() => setShowAddContact(true)}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          )}
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <Phone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No emergency contacts added</p>
            <p className="text-xs text-gray-300 mt-1">Add up to 3 contacts for SOS alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact: any) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-400">{contact.phone} · {contact.relationship}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteContactMutation.mutate(contact.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-500" /> Safety Guidelines
        </h2>
        <ul className="space-y-2.5">
          {[
            'Always verify co-travelers through the app before meeting',
            'Share your trip itinerary with someone you trust',
            'Meet new travel companions in public places first',
            'Keep your location sharing on during trips',
            'Trust your instincts — leave any uncomfortable situation',
            'Report any suspicious behavior through the app',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-600 text-xs font-bold">{i + 1}</span>
              </div>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Report & Block section */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Report & Block</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowReport(true)}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all"
          >
            <Flag className="w-6 h-6 text-red-400" />
            <span className="text-sm font-medium text-gray-600">Report User</span>
          </button>
          <button
            onClick={() => setShowBlock(true)}
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <UserX className="w-6 h-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Block User</span>
          </button>
        </div>
      </div>

      {/* Report User Modal */}
      <Modal isOpen={showReport} onClose={() => { setShowReport(false); setReportUser(null); setReportSearch(''); }} title="Report a User">
        <div className="space-y-4">
          {!reportUser ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Search user to report</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="input-field pl-9 text-sm"
                  placeholder="Type name or email..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </div>
              {reportSearch.length >= 2 && searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {searchResults.slice(0, 5).map((u: any) => (
                    <button
                      key={u.id}
                      onClick={() => { setReportUser(u); setReportSearch(''); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                        {u.firstName?.[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                    </button>
                  ))}
                </div>
              )}
              {reportSearch.length >= 2 && searchResults.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">No users found.</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm shrink-0">
                  {reportUser.firstName?.[0]}
                </div>
                <span className="font-medium text-gray-900">{reportUser.firstName} {reportUser.lastName}</span>
                <button onClick={() => setReportUser(null)} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Change</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
                <select
                  className="input-field text-sm"
                  value={reportData.reason}
                  onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                >
                  {REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
                <textarea
                  className="input-field resize-none h-20 text-sm"
                  placeholder="Describe what happened..."
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                />
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full !bg-red-500 hover:!bg-red-600"
                loading={reportMutation.isPending}
                onClick={() => reportMutation.mutate()}
              >
                Submit Report
              </Button>
            </>
          )}
        </div>
      </Modal>

      {/* Block User Modal */}
      <Modal isOpen={showBlock} onClose={() => { setShowBlock(false); setBlockUser(null); setBlockSearch(''); }} title="Block a User">
        <div className="space-y-4">
          {!blockUser ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Search user to block</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="input-field pl-9 text-sm"
                  placeholder="Type name or email..."
                  value={blockSearch}
                  onChange={(e) => setBlockSearch(e.target.value)}
                />
              </div>
              {blockSearch.length >= 2 && blockSearchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {blockSearchResults.slice(0, 5).map((u: any) => (
                    <button
                      key={u.id}
                      onClick={() => { setBlockUser(u); setBlockSearch(''); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                        {u.firstName?.[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                    </button>
                  ))}
                </div>
              )}
              {blockSearch.length >= 2 && blockSearchResults.length === 0 && (
                <p className="text-xs text-gray-400 mt-2">No users found.</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                  {blockUser.firstName?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{blockUser.firstName} {blockUser.lastName}</p>
                  <p className="text-xs text-gray-400">They won&apos;t be able to message you or see your trips.</p>
                </div>
                <button onClick={() => setBlockUser(null)} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Change</button>
              </div>
              <p className="text-sm text-gray-500">
                Blocking <strong>{blockUser.firstName}</strong> will prevent them from seeing your profile and sending you messages.
              </p>
              <Button
                variant="primary"
                size="md"
                className="w-full !bg-gray-800 hover:!bg-gray-900"
                loading={blockMutation.isPending}
                onClick={() => blockMutation.mutate()}
              >
                Block User
              </Button>
            </>
          )}
        </div>
      </Modal>

      {/* Add Contact Modal */}
      <Modal isOpen={showAddContact} onClose={() => setShowAddContact(false)} title="Add Emergency Contact">
        <div className="space-y-4">
          <Input label="Full Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="Mom / Dad / Friend..." />
          <Input label="Phone Number" type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="+91 9876543210" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Relationship</label>
            <select className="input-field text-sm" value={newContact.relationship} onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}>
              <option value="">Select...</option>
              {['Parent', 'Sibling', 'Partner', 'Friend', 'Colleague', 'Other'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <Button variant="primary" size="md" className="w-full" loading={addContactMutation.isPending} onClick={() => addContactMutation.mutate()}>
            Add Contact
          </Button>
        </div>
      </Modal>
    </div>
  );
}
