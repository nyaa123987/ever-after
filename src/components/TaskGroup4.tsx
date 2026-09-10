import TaskGroup, { Task } from './TaskGroup';
import Link from 'next/link';

interface Props {
  activeGroup: string | null;
  setActiveGroup: (groupName: string) => void;
  completions: Record<string, boolean>;
  onToggle: (taskKey: string) => void;
}

const GROUP_NAME = 'TaskGroup4';

const BASE_TASKS: Omit<Task, 'completed'>[] = [
    { id: 1, text: 'Rings and ring cushion' },
    { id: 2, text: 'Address your invitations' },
    { id: 3, text: 'Transportation' },
    { id: 4, text: 'Mail or deliver your invitations' },
  ];

export default function TaskGroup4({ activeGroup, setActiveGroup, completions, onToggle }: Props) {
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
                <p>Purchase your ring cushion if you are going to have ring bearer.</p>
                <Link href='/vendors/jewelry'>Discover jewelry vendors.</Link>
            </>
        )
    }
    if (task.id === 3) {
        return (
            <>
                <p>Arrange your transportation to and from the ceremony.</p>
                <Link href='/transportation'>Transportation tips</Link>
            </>
        )
    }
    if (task.id === 4) {
        return (
            <>
                <Link href='/invitation-mailing'>Did you know?</Link>
            </>
        )
    }
    return null;
  };

  return (
    <TaskGroup
      title="Two months before the wedding"
      groupName={GROUP_NAME}
      tasks={tasks}
      onTaskToggle={toggleTask}
      activeGroup={activeGroup}
      setActiveGroup={setActiveGroup}
      renderExtras={renderExtras}
    />
  );
}
