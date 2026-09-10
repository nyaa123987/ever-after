import TaskGroup, { Task } from './TaskGroup';
import Link from 'next/link';

interface Props {
  activeGroup: string | null;
  setActiveGroup: (groupName: string) => void;
  completions: Record<string, boolean>;
  onToggle: (taskKey: string) => void;
}

const GROUP_NAME = 'TaskGroup1';

const BASE_TASKS: Omit<Task, 'completed'>[] = [
    { id: 1, text: 'Set your wedding date' },
    { id: 2, text: 'Determine your wedding budget' },
    { id: 3, text: 'Start a wedding file where all correspondence, quotes or ideas needs to be filed.' },
    { id: 4, text: 'Create your guest list' },
    { id: 5, text: 'Hire a wedding planner (if needed)' },
    { id: 6, text: 'Book your venue' },
    { id: 7, text: 'Have a meeting with whoever is going to lead the ceremony.' },
  ];

export default function TaskGroup1({ activeGroup, setActiveGroup, completions, onToggle }: Props) {
  const tasks: Task[] = BASE_TASKS.map((t) => ({
    ...t,
    completed: completions[`${GROUP_NAME}-${t.id}`] ?? false,
  }));

  const toggleTask = (id: number) => {
    onToggle(`${GROUP_NAME}-${id}`);
  };

  const renderExtras = (task: Task) => {
    if (task.id === 1) {
        return <p>This is the most important part of planning your wedding and it is where it all begins. Consider public holidays while planning your wedding date. But do remember that this is your wedding, if the date works for you and your fiance then go with it, don&apos;t let others influence your decision.</p>
    }
    if (task.id === 2) {
        return <p>The most crucial issue in all weddings is the budget - make sure you sort out your budget before any planning begins. If you are splitting the cost between both families then make it clear about who is paying for what. Money can be a major cause of stress in wedding planning, so get organised and get that budget.</p>
    }
    if (task.id === 4) {
      return (
        <div className='flex flex-col'>
            <p>Draw up your guest list and decide if you want to include children.</p>
            <Link className='text-[blue] hover:underline pt-[2vh]' href="/guests">Get started</Link>
        </div>
      )
    }
    if (task.id === 5) {
      return (
        <div className='flex flex-col'>
            <p>Nowadays, most people have a wedding planner to organise their wedding. Here are few tips to help you choose the right one for the job:</p>
            <ul className="list-none space-y-2 flex flex-col self-center">
                <li className="flex items-start pt-[2vh]"><span className="text-black mx-2 mt-0.5">➤</span><span className="italic">Ask for referrals.</span></li>
                <li className="flex items-start"><span className="text-black mx-2 mt-0.5">➤</span><span className="italic">Make sure you interview potential wedding planner candidates before you hire one for the job. Ask them for a portfolio of weddings that they have planned, as well as client details of weddings that they have planned in the past.</span></li>
                <li className="flex items-start"><span className="text-black mx-2 mt-0.5">➤</span><span className="italic">Tell them ideas you may already have and see what kind of creative input and suggestions they may have to add to your ideas.</span></li>
                <li className="flex items-start"><span className="text-black mx-2 mt-0.5">➤</span><span className="italic">Make sure you find out their fee prior to booking, and include this in your budget.</span></li>
            </ul>
            <Link className='text-[blue] hover:underline pt-[2vh]' href='/vendors/wedding-planners'>Browse available vendors</Link>
        </div>
      )
    }
    if (task.id === 6) {
        return (
            <div className='flex flex-col'>
                <p>Shop around for your reception venue and reserve the one you like. Choose your location for the wedding ceremony.</p>
                <Link className='text-[blue] hover:underline pt-[2vh]' href='/vendors/venues'>Possible venues</Link>
            </div>
        )
    }
    return null;
  };

  return (
    <main>
        <TaskGroup
            title="Ten months before the wedding"
            groupName={GROUP_NAME}
            tasks={tasks}
            onTaskToggle={toggleTask}
            activeGroup={activeGroup}
            setActiveGroup={setActiveGroup}
            renderExtras={renderExtras}
        />
    </main>
  );
}
