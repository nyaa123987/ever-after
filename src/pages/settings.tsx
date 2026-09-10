import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import H1 from '@/components/Heading1';
import Toast from '@/components/Toast';
import ProtectedPage from '@/components/ProtectedPage';
import { useWedding } from '@/lib/WeddingContext';
import { supabase } from '@/lib/supabaseClient';

function SettingsContent() {
  const router = useRouter();
  const { user, profile, signOut } = useWedding();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [toast, setToast] = useState('');

  const [feedback, setFeedback] = useState('');
  const [fbLoading, setFbLoading] = useState(false);

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');

    if (!user?.email) return;
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }

    setPwLoading(true);

    // Verify the old password by re-authenticating before allowing the change.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (verifyError) {
      setPwLoading(false);
      setPwError('Your current password is incorrect.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);

    if (updateError) {
      setPwError(updateError.message);
      return;
    }

    setOldPassword('');
    setNewPassword('');
    flashToast('Password updated!');
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !user) return;

    setFbLoading(true);
    const { error } = await supabase.from('feedback').insert([{ user_id: user.id, message: feedback.trim() }]);
    setFbLoading(false);

    if (!error) {
      setFeedback('');
      flashToast('Thanks for the feedback!');
    }
  };

  return (
    <div className="py-8 px-[4%] max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard"><ArrowLeft className="w-6 h-6 cursor-pointer" /></Link>
        <H1>Settings</H1>
        <div className="w-6" />
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">Signed in as</p>
        <p className="font-medium">{profile?.name} ({user?.email})</p>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold mb-3">Change password</h2>
        {pwError && <p className="text-red-500 text-sm mb-2">{pwError}</p>}
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border w-full p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border w-full p-2 rounded"
            required
          />
          <button type="submit" disabled={pwLoading} className="bg-[#B85042] text-white px-4 py-2 rounded w-full disabled:opacity-50">
            {pwLoading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold mb-3">Send us feedback</h2>
        <form onSubmit={handleFeedback} className="space-y-3">
          <textarea
            placeholder="Tell us what's working or what could be better..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="border w-full p-2 rounded"
          />
          <button type="submit" disabled={fbLoading} className="bg-gray-600 text-white px-4 py-2 rounded w-full disabled:opacity-50">
            {fbLoading ? 'Sending...' : 'Send feedback'}
          </button>
        </form>
      </div>

      <button onClick={handleLogout} className="w-full border border-red-400 text-red-500 py-2 rounded hover:bg-red-50 transition">
        Log out
      </button>

      {toast && <Toast message={toast} />}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <SettingsContent />
    </ProtectedPage>
  );
}
