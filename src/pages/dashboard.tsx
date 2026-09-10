import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedPage from '@/components/ProtectedPage';
import { useWedding } from '@/lib/WeddingContext';
import { useTaskCompletions } from '@/lib/useTaskCompletions';
import { TOTAL_TASK_COUNT, countCompleted } from '@/lib/taskCatalog';
import { getWeddingCountdown } from '@/lib/dateUtils';

function DashboardContent() {
  const router = useRouter();
  const { profile, wedding, members, signOut } = useWedding();
  const { completions, loaded } = useTaskCompletions(wedding?.id ?? null);
  const [dismissedNudge, setDismissedNudge] = useState(false);

  const { status, daysLeft } = getWeddingCountdown(wedding?.wedding_date ?? null);
  const done = loaded ? countCompleted(completions) : 0;
  const pct = TOTAL_TASK_COUNT ? Math.round((done / TOTAL_TASK_COUNT) * 100) : 0;
  const remaining = TOTAL_TASK_COUNT - done;

  const showNudge =
    loaded && !dismissedNudge && status === 'upcoming' && daysLeft !== null && daysLeft <= 60 && remaining > 8;

  useEffect(() => { setDismissedNudge(false); }, [wedding?.id]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const centerText = () => {
    if (status === 'past') return 'Congratulations! You are already married.';
    if (status === 'today') return "Congratulations, you're getting married today!";
    if (daysLeft !== null) {
      return (
        <>
          <span className="text-8xl">{daysLeft}</span>
          <br />
          days left
        </>
      );
    }
    return 'Loading...';
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-between" style={{ background: 'radial-gradient(circle, #EEEDDB 40%, #E3D3B9 100%)' }}>
      <div className="flex flex-wrap justify-between items-center gap-3 bg-[#E6D3C6] py-[2vh] px-[3%]">
        <h1 className="tangerine text-4xl text-center">Ever After</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-700 hidden sm:inline">Hello, {profile?.name ?? 'there'}</span>
          <Link href="/members" className="bg-gray-500 text-white text-sm px-2 py-1 rounded hover:bg-gray-600 transition">People</Link>
          <Link href="/messages" className="bg-gray-500 text-white text-sm px-2 py-1 rounded hover:bg-gray-600 transition">Messages</Link>
          <Link href="/notes" className="bg-gray-500 text-white text-sm px-2 py-1 rounded hover:bg-gray-600 transition">Notes</Link>
          <Link href="/settings" className="bg-gray-500 text-white text-sm px-2 py-1 rounded hover:bg-gray-600 transition">Settings</Link>
          <button onClick={handleLogout} className="bg-[#B85042] text-white text-sm px-2 py-1 rounded hover:bg-[#A03F37] transition shadow-md">Logout</button>
        </div>
      </div>

      <div className="px-[3%] pt-4 text-center">
        <h1 className="tangerine text-4xl sm:text-5xl">Hello, {profile?.name ?? 'there'}</h1>
        {members.length > 1 && (
          <p className="text-sm text-gray-600 mt-1">
            Planning together with {members.length - 1} other{members.length - 1 === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {showNudge && (
        <div className="mx-auto mt-4 max-w-xl w-[92%] bg-white border border-[#E4B441] rounded-xl px-4 py-3 flex items-start justify-between gap-3 shadow">
          <p className="text-sm text-gray-700">
            {daysLeft} day{daysLeft === 1 ? '' : 's'} to go and {remaining} checklist item{remaining === 1 ? '' : 's'} still open. No rush — just a gentle nudge to peek at your{' '}
            <Link href="/schedule" className="text-[#B85042] underline">wedding plan</Link>.
          </p>
          <button onClick={() => setDismissedNudge(true)} className="text-gray-400 hover:text-gray-600 text-lg leading-none" aria-label="Dismiss">×</button>
        </div>
      )}

      <div className="w-3/4 h-5 mx-auto mt-8 md:my-6 rounded-3xl border-[#E4B441] border-2">
        <div className="bg-[#E4B441] border-[#E4B441] border-2 h-4 rounded-3xl transition-all" style={{ width: `${pct}%` }}></div>
      </div>

      <div className="relative w-[100%] h-[60vh] flex items-center justify-center" style={{ backgroundImage: "url('/images/hero-image.png')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', imageRendering: 'auto' }}>
        <h1 className="tangerine text-5xl pb-[15vh] text-center">{centerText()}</h1>
      </div>

      <div className="flex justify-center cursor-pointer">
        <Link href="/schedule" className="tangerine text-3xl md:text-5xl text-center border-2 border-[#E4B441] p-2 shine-border-bg">Today&apos;s Task</Link>
      </div>

      <div className="flex flex-wrap justify-center align-middle gap-[5%] bg-[#E6D3C6] py-[2vh] mt-[5vh]">
        <Link href="/guests">Guests</Link>
        <Link href="/schedule">Schedule</Link>
        <Link href="/vendors">Vendors</Link>
        <Link href="/saved">Saved</Link>
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <ProtectedPage>
      <DashboardContent />
    </ProtectedPage>
  );
}
