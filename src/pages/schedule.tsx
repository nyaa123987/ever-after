import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TaskGroup1 from '@/components/TaskGroup1';
import TaskGroup2 from '@/components/TaskGroup2';
import TaskGroup3 from '@/components/TaskGroup3';
import TaskGroup4 from '@/components/TaskGroup4';
import TaskGroup5 from '@/components/TaskGroup5';
import TaskGroup6 from '@/components/TaskGroup6';
import H1 from '@/components/Heading1';
import ProtectedPage from '@/components/ProtectedPage';
import { useWedding } from '@/lib/WeddingContext';
import { useTaskCompletions } from '@/lib/useTaskCompletions';
import { TOTAL_TASK_COUNT, countCompleted } from '@/lib/taskCatalog';

function ScheduleContent() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const { wedding, isEditor } = useWedding();
  const { completions, toggle, loaded } = useTaskCompletions(wedding?.id ?? null);

  const done = countCompleted(completions);
  const pct = TOTAL_TASK_COUNT ? Math.round((done / TOTAL_TASK_COUNT) * 100) : 0;

  const handleToggle = (key: string) => {
    if (!isEditor) return;
    toggle(key);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard"><ArrowLeft className="w-6 h-6" /></Link>
        <H1>My Wedding Plan</H1>
        <div className="w-6" />
      </div>

      {!isEditor && (
        <p className="text-center text-sm text-gray-500 mb-4 italic">
          You have view-only access to this wedding, so checklist items can only be ticked off by the couple.
        </p>
      )}

      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Overall progress</span>
          <span>{loaded ? `${done} / ${TOTAL_TASK_COUNT} tasks (${pct}%)` : 'Loading...'}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-3 rounded-full bg-[#E4B441] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <TaskGroup1 activeGroup={activeGroup} setActiveGroup={setActiveGroup} completions={completions} onToggle={handleToggle} />
      <TaskGroup2 activeGroup={activeGroup} setActiveGroup={setActiveGroup} completions={completions} onToggle={handleToggle} />
      <TaskGroup3 activeGroup={activeGroup} setActiveGroup={setActiveGroup} completions={completions} onToggle={handleToggle} />
      <TaskGroup4 activeGroup={activeGroup} setActiveGroup={setActiveGroup} completions={completions} onToggle={handleToggle} />
      <TaskGroup5 activeGroup={activeGroup} setActiveGroup={setActiveGroup} completions={completions} onToggle={handleToggle} />
      <TaskGroup6 activeGroup={activeGroup} setActiveGroup={setActiveGroup} completions={completions} onToggle={handleToggle} />
    </main>
  );
}

export default function SchedulePage() {
  return (
    <ProtectedPage>
      <ScheduleContent />
    </ProtectedPage>
  );
}
