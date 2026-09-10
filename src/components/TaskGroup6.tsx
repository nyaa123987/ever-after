import TaskGroup, { Task } from './TaskGroup';

interface Props {
  activeGroup: string | null;
  setActiveGroup: (groupName: string) => void;
  completions: Record<string, boolean>;
  onToggle: (taskKey: string) => void;
}

const GROUP_NAME = 'TaskGroup6';

const BASE_TASKS: Omit<Task, 'completed'>[] = [
    { id: 1, text: 'Caterer' },
    { id: 2, text: 'Honeymoon reservations' },
    { id: 3, text: 'Finalise all minors' },
    { id: 4, text: 'Wedding rehearsal' },
    { id: 5, text: 'Suppliers' },
    { id: 6, text: 'Confirm transportation' },
  ];

export default function TaskGroup6({ activeGroup, setActiveGroup, completions, onToggle }: Props) {
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
                <p>Finalise numbers with your caterer.</p>
            </>
        )
    }
    if (task.id === 2) {
        return (
            <>
                <p>Confirm your honeymoon reservations and pack for your honeymoon.</p>
            </>
        )
    }
    if (task.id === 3) {
        return (
            <>
                <p>Finalise all minor details such as speeches, etc.</p>
            </>
        )
    }
    if (task.id === 4) {
        return (
            <>
                <p>Have your wedding rehearsal.</p>
            </>
        )
    }
    if (task.id === 5) {
        return (
            <>
                <p>Make sure all Suppliers have been paid.</p>
            </>
        )
    }
    if (task.id === 6) {
        return (
            <>
                <p>Confirm your transportation to and from the ceremony, and to the airport for your honeymoon.</p>
            </>
        )
    }
    return null;
  };

  return (
    <TaskGroup
      title="Final week before the wedding"
      groupName={GROUP_NAME}
      tasks={tasks}
      onTaskToggle={toggleTask}
      activeGroup={activeGroup}
      setActiveGroup={setActiveGroup}
      renderExtras={renderExtras}
    />
  );
}
