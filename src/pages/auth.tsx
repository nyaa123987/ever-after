import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { CITY_OPTIONS } from '@/types/wedding';

type Mode = 'login' | 'signup';
type Step = 'credentials' | 'details';

type PendingInvite = {
  id: string;
  wedding_id: string;
  role: 'partner' | 'collaborator';
  name: string | null;
} | null;

async function findPendingInvite(email: string): Promise<PendingInvite> {
  const { data } = await supabase
    .from('invites')
    .select('id, wedding_id, role, name')
    .eq('email', email)
    .eq('status', 'pending')
    .maybeSingle();
  return (data as PendingInvite) ?? null;
}

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [step, setStep] = useState<Step>('credentials');
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [invite, setInvite] = useState<PendingInvite>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [city, setCity] = useState<string>('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setChecking(false);
        return;
      }

      const { data: profileRow } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!profileRow) {
        setEmail(user.email ?? '');
        const pending = await findPendingInvite(user.email ?? '');
        setInvite(pending);
        setStep('details');
        setChecking(false);
        return;
      }

      const { data: membership } = await supabase
        .from('wedding_members')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'accepted')
        .maybeSingle();

      if (membership) {
        router.push('/dashboard');
      } else {
        setChecking(false);
      }
    };

    checkUser();
  }, [router]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (!data.session) {
          setInfo('Check your email to confirm your account, then come back and log in.');
          return;
        }

        const pending = await findPendingInvite(email);
        setInvite(pending);
        setStep('details');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileRow } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!profileRow) {
          const pending = await findPendingInvite(email);
          setInvite(pending);
          setStep('details');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!invite && (!weddingDate || !city || !budget)) {
      setError('Please fill in your wedding date, city, and budget.');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Your session expired — please log in again.');
        return;
      }

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          name: name.trim(),
          email: user.email,
          gender: gender || null,
          age: age ? Number(age) : null,
        },
      ]);
      if (profileError) {
        setError(profileError.message);
        return;
      }

      if (invite) {
        const { error: memberError } = await supabase.from('wedding_members').insert([
          {
            wedding_id: invite.wedding_id,
            user_id: user.id,
            role: invite.role,
            status: 'accepted',
          },
        ]);
        if (memberError) {
          setError(memberError.message);
          return;
        }
        await supabase.from('invites').update({ status: 'accepted' }).eq('id', invite.id);
      } else {
        const { data: weddingRow, error: weddingError } = await supabase
          .from('weddings')
          .insert([
            {
              owner_id: user.id,
              partner_name: partnerName.trim() || null,
              wedding_date: weddingDate,
              budget: Number(budget),
              city,
            },
          ])
          .select()
          .single();

        if (weddingError || !weddingRow) {
          setError(weddingError?.message ?? 'Could not create your wedding.');
          return;
        }

        const { error: memberError } = await supabase.from('wedding_members').insert([
          {
            wedding_id: weddingRow.id,
            user_id: user.id,
            role: 'owner',
            status: 'accepted',
          },
        ]);
        if (memberError) {
          setError(memberError.message);
          return;
        }
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E4B441] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking session...</p>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/sign-in-hero.jpeg')" }}>
        <div className="w-full max-w-md bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg">
          <h1 className="tangerine text-5xl text-center mb-2">Ever After</h1>
          <p className="text-center text-gray-600 mb-6">
            {invite
              ? `You've been invited to join a wedding${invite.role === 'collaborator' ? ' as a helper (view-only)' : ' as a partner'}. Just a few details about you first.`
              : "Tell us a little about you and your big day."}
          </p>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441]" required />

            <div className="grid grid-cols-2 gap-3">
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441] text-gray-700">
                <option value="">Gender (optional)</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <input type="number" min={16} max={120} placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441]" />
            </div>

            {!invite && (
              <>
                <input type="text" placeholder="Partner's name (optional)" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441]" />

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Wedding date</label>
                  <input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441]" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441] text-gray-700" required>
                    <option value="">City</option>
                    {CITY_OPTIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                  <input type="number" min={0} placeholder="Budget (USD)" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441]" required />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="w-full bg-[#B85042] text-white py-2 rounded-lg hover:bg-[#A03F37] transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Continue to my dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/sign-in-hero.jpeg')" }}>
      <div className="w-full max-w-md bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg">
        <h1 className="tangerine text-5xl text-center mb-6">Ever After</h1>
        <h2 className="text-2xl font-bold text-center mb-6">{mode === 'signup' ? 'Sign Up' : 'Log In'}</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {info && <p className="text-green-600 text-sm mb-4 text-center">{info}</p>}

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441]" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B441]" required />

          <button type="submit" disabled={loading} className="w-full bg-[#B85042] text-white py-2 rounded-lg hover:bg-[#A03F37] transition disabled:opacity-50">
            {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); setInfo(''); }} className="text-[#B85042] font-semibold cursor-pointer hover:underline">
            {mode === 'signup' ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}
