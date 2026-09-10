import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import H1 from '@/components/Heading1';
import Toast from '@/components/Toast';
import ProtectedPage from '@/components/ProtectedPage';
import { useWedding } from '@/lib/WeddingContext';
import { supabase } from '@/lib/supabaseClient';

function MembersContent() {
  const { wedding, members, isEditor, refresh, user } = useWedding();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'partner' | 'collaborator'>('partner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding || !user) return;
    setError('');

    if (!email.trim()) { setError('Please enter an email address.'); return; }

    const alreadyMember = members.some((m) => m.profile?.email === email.trim());
    if (alreadyMember) { setError('That person is already part of your wedding.'); return; }

    setLoading(true);
    const { error: inviteError } = await supabase.from('invites').insert([
      { wedding_id: wedding.id, invited_by: user.id, name: name.trim() || null, email: email.trim(), role, status: 'pending' },
    ]);
    setLoading(false);

    if (inviteError) { setError(inviteError.message); return; }

    flashToast(`Invite ready for ${email}. Share the app link with them — they'll join automatically once they sign up or log in with that email.`);
    setName('');
    setEmail('');
  };

  const handleRemove = async (memberId: string) => {
    await supabase.from('wedding_members').delete().eq('id', memberId);
    refresh();
    flashToast('Removed.');
  };

  return (
    <div className="py-8 px-[4%] max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard"><ArrowLeft className="w-6 h-6 cursor-pointer" /></Link>
        <H1>People</H1>
        <div className="w-6" />
      </div>

      <h2 className="font-semibold mb-3">Who&apos;s already in</h2>
      <div className="space-y-2 mb-8">
        {members.map((m) => (
          <div key={m.id} className="flex justify-between items-center bg-[#F5F5F5] p-3 rounded">
            <div>
              <p className="font-medium">{m.profile?.name ?? m.profile?.email}</p>
              <p className="text-xs text-gray-500 capitalize">
                {m.role === 'owner' ? 'Owner' : m.role === 'partner' ? 'Partner (full access)' : 'Helper (view only)'}
              </p>
            </div>
            {isEditor && m.role !== 'owner' && m.user_id !== user?.id && (
              <button onClick={() => handleRemove(m.id)} className="text-red-500 text-xs hover:underline">Remove</button>
            )}
          </div>
        ))}
      </div>

      {isEditor && (
        <>
          <h2 className="font-semibold mb-3">Invite someone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Invite your partner for full shared access (tasks, notes, vendors, messages), or invite
            a helper like a wedding organiser or vendor coordinator who can view everything but not
            edit or create.
          </p>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <form onSubmit={handleInvite} className="space-y-3">
            <input type="text" placeholder="Their name" value={name} onChange={(e) => setName(e.target.value)} className="border w-full p-2 rounded" />
            <input type="email" placeholder="Their email" value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full p-2 rounded" required />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={role === 'partner'} onChange={() => setRole('partner')} />
                Partner (full access)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={role === 'collaborator'} onChange={() => setRole('collaborator')} />
                Helper (view only)
              </label>
            </div>
            <button type="submit" disabled={loading} className="bg-[#B85042] text-white px-4 py-2 rounded w-full disabled:opacity-50">
              {loading ? 'Sending invite...' : 'Invite'}
            </button>
          </form>
        </>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

export default function MembersPage() {
  return (
    <ProtectedPage>
      <MembersContent />
    </ProtectedPage>
  );
}
