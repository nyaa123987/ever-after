import TaskGroup, { Task } from './TaskGroup';
import Link from 'next/link';

interface Props {
  activeGroup: string | null;
  setActiveGroup: (groupName: string) => void;
  completions: Record<string, boolean>;
  onToggle: (taskKey: string) => void;
}

const GROUP_NAME = 'TaskGroup3';

const BASE_TASKS: Omit<Task, 'completed'>[] = [
    { id: 1, text: 'Work on your guest list' },
    { id: 2, text: 'Start planning your honeymoon' },
    { id: 3, text: 'Choose your invitations' },
    { id: 4, text: 'Bridal wear (gowns and dresses)' },
    { id: 5, text: "Groom's suits" },
    { id: 6, text: 'Shoes (ladies)' },
    { id: 7, text: 'Shoes (groom)' },
  ];

export default function TaskGroup3({ activeGroup, setActiveGroup, completions, onToggle }: Props) {
  const tasks: Task[] = BASE_TASKS.map((t) => ({
    ...t,
    completed: completions[`${GROUP_NAME}-${t.id}`] ?? false,
  }));

  const toggleTask = (id: number) => {
    onToggle(`${GROUP_NAME}-${id}`);
  };

  const renderExtras = (task: Task) => {
    if (task.id === 3) {
        return (
            <>
                <p>If you are going to make your own invitations, then choose your paper and start making them, as this will take longer than ordering them through a printer.</p>
                <Link href='/invitation-card'>See invitation card designs</Link>
                <Link href='/vendors/invitations'>See invitation card vendors</Link>
            </>
        )
    }
    if (task.id === 4) {
        return (
            <>
                <p>For the bride: Find a reautable dressmaker or store to design or buy your dress, as well as your bridesmaids&apos; dresses.</p>
                <Link href='/dresses'>See beautiful designs</Link>
                <Link href='/vendors/bridal-wear'>Need a dressmaker vendor?</Link>
            </>
        )
    }
    if (task.id === 5) {
        return (
            <>
                <p>For the groom: Find a reputable dressmaker or store to design or buy your suit.</p>
                <Link href='/suits'>See designs</Link>
                <Link href='/vendors/groom-wear'>Need a dressmaker vendor?</Link>
            </>
        )
    }
    if (task.id === 6) {
        return (
            <>
                <p>For the bride: Be smart when choosing your shoes and make sure you get comfortable ones and break them in, the last thing you need are blisters on your wedding day.</p>
                <Link href='/shoes'>See beautiful designs</Link>
                <Link href='/vendor/bridal-shoes'>Need a dressmaker vendor?</Link>
            </>
        )
    }
    if (task.id === 7) {
        return (
            <>
                <Link href='/shoes'>See designs</Link>
                <Link href='/vendors/groom-shoes'>Need a dressmaker vendor?</Link>
            </>
        )
    }
    return null;
  };

  return (
    <TaskGroup
      title="Five months before the wedding"
      groupName={GROUP_NAME}
      tasks={tasks}
      onTaskToggle={toggleTask}
      activeGroup={activeGroup}
      setActiveGroup={setActiveGroup}
      renderExtras={renderExtras}
    />
  );
}
