import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import H1 from '../components/Heading1';
import AddGuestForm from '../components/AddGuestForm';
import GuestItem from '../components/GuestItem';
import InviteGuestsModal from '../components/InviteGuestsModal';
import Toast from '../components/Toast';
import ProtectedPage from '../components/ProtectedPage';
import { Guest } from '../types/guest';
import { supabase } from '../lib/supabaseClient';
import { useWedding } from '../lib/WeddingContext';

function GuestsContent() {
  const { wedding, isEditor } = useWedding();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [toast, setToast] = useState('');

  const fetchGuests = useCallback(async () => {
    if (!wedding) return;
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', wedding.id)
      .order('created_at', { ascending: false });
    if (data) setGuests(data);
    if (error) console.error('Fetch guests error:', error.message);
  }, [wedding]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddGuest = async (guest: Guest) => {
    if (!wedding) return;
    const { error } = await supabase.from('guests').insert([{ ...guest, wedding_id: wedding.id }]);
    if (!error) { flashToast('Guest added!'); fetchGuests(); }
    setShowForm(false);
  };

  const handleEditGuest = async (guest: Guest) => {
    if (!guest.id) return;
    const { error } = await supabase
      .from('guests')
      .update({ name: guest.name, email: guest.email, max_guests: guest.max_guests })
      .eq('id', guest.id);
    if (!error) { flashToast('Guest updated!'); fetchGuests(); }
    setEditGuest(null);
    setShowForm(false);
  };

  const handleRemoveGuest = async (id: string) => {
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) { flashToast('Guest removed!'); fetchGuests(); }
  };

  const totalHeadcount = guests.reduce((sum, g) => sum + (g.max_guests ?? 1), 0);
  const missingEmailCount = guests.filter((g) => !g.email).length;

  return (
    <div className="py-8 relative px-[2%] max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <Link href="/dashboard"><ArrowLeft className="w-6 h-6 cursor-pointer" /></Link>
        <H1>Guest List</H1>
        {isEditor ? (
          <button onClick={() => { setEditGuest(null); setShowForm(true); }} className="bg-green-500 text-white px-3 py-1 rounded">Add Guest</button>
        ) : (<div className="w-6" />)}
      </div>

      {!isEditor && (
        <p className="text-center text-sm text-gray-500 mb-4 italic">
          You have view-only access — only the couple can add, edit, or remove guests.
        </p>
      )}

      <div>
        {guests.length === 0 && <p className="text-center text-gray-400 text-sm">No guests added yet.</p>}
        {guests.map((guest) => (
          <GuestItem key={guest.id} guest={guest} onRemove={() => handleRemoveGuest(guest.id!)} onEdit={() => { setEditGuest(guest); setShowForm(true); }} />
        ))}
      </div>

      {guests.length > 0 && (
        <div className="mt-6 bg-[#EEEDDB] rounded-lg p-4 flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="font-semibold">Total expected guests: {totalHeadcount}</p>
            {missingEmailCount > 0 && (
              <p className="text-xs text-red-500">{missingEmailCount} guest{missingEmailCount === 1 ? '' : 's'} without an email — call them or send a card instead.</p>
            )}
          </div>
          {isEditor && (
            <button onClick={() => setShowInvite(true)} className="bg-[#B85042] text-white px-3 py-2 rounded text-sm">Send Invitations</button>
          )}
        </div>
      )}

      {showForm && (
        <AddGuestForm onClose={() => { setShowForm(false); setEditGuest(null); }} onSubmit={editGuest ? handleEditGuest : handleAddGuest} isEditMode={!!editGuest} initialGuest={editGuest || undefined} />
      )}

      {showInvite && wedding && (
        <InviteGuestsModal guests={guests} venue={wedding.city ?? ''} weddingDate={wedding.wedding_date ?? ''} onClose={() => setShowInvite(false)} />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

export default function Guests() {
  return (
    <ProtectedPage>
      <GuestsContent />
    </ProtectedPage>
  );
}
