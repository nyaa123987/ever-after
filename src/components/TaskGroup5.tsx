import TaskGroup, { Task } from './TaskGroup';
import Link from 'next/link';

interface Props {
  activeGroup: string | null;
  setActiveGroup: (groupName: string) => void;
  completions: Record<string, boolean>;
  onToggle: (taskKey: string) => void;
}

const GROUP_NAME = 'TaskGroup5';

const BASE_TASKS: Omit<Task, 'completed'>[] = [
    { id: 1, text: 'Beauty' },
    { id: 2, text: 'Make-up and hair' },
    { id: 3, text: 'Pick up the rings and make sure they fit' },
    { id: 4, text: 'Bridal wear' },
    { id: 5, text: 'Plan reception layout' },
    { id: 6, text: 'Finalise your place card settings' },
  ];

export default function TaskGroup5({ activeGroup, setActiveGroup, completions, onToggle }: Props) {
  const tasks: Task[] = BASE_TASKS.map((t) => ({
    ...t,
    completed: completions[`${GROUP_NAME}-${t.id}`] ?? false,
  }));

  const toggleTask = (id: number) => {
    onToggle(`${GROUP_NAME}-${id}`);
  };

  const renderExtras = (task: Task) => {
    if (task.id === 1) {
        return (
            <>
                <p>Schedule your beauty and body treatments.</p>
                <Link href='/beauty'>Tips and tricks</Link>
            </>
        )
    }
    if (task.id === 2) {
        return (
            <>
                <p>Have a make-up and hair trial and book your appointment for the day.</p>
                <Link href='/make-up'>Beauty tips</Link>
                <Link href='/vendors/beauticians'>Find a beautician.</Link>
            </>
        )
    }
    if (task.id === 4) {
        return (
            <>
                <p>Finalise your dress and have fittings for you and your bridesmaids.</p>
            </>
        )
    }
    if (task.id === 5) {
        return (
            <>
                <p>Co-ordinate and plan your reception layout, as well as speeches etc.</p>
            </>
        )
    }
    return null;
  };

  return (
    <TaskGroup
      title="A month before the wedding"
      groupName={GROUP_NAME}
      tasks={tasks}
      onTaskToggle={toggleTask}
      activeGroup={activeGroup}
      setActiveGroup={setActiveGroup}
      renderExtras={renderExtras}
    />
  );
}
