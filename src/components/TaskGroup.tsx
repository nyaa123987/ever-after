import { useState, useEffect, useRef } from 'react';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  groupName: string;
  activeGroup: string | null;
  setActiveGroup: (groupName: string) => void;
  onTaskToggle: (id: number) => void;
  renderExtras?: (task: Task) => React.ReactNode;
}

export default function TaskGroup({
  title,
  tasks,
  groupName,
  activeGroup,
  setActiveGroup,
  onTaskToggle,
  renderExtras,
}: TaskGroupProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'remaining'>('all');
  const firstIncompleteRef = useRef<HTMLLIElement>(null);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'remaining') return !task.completed;
  });

  const hasCompleted = tasks.some(task => task.completed);
  const hasRemaining = tasks.some(task => !task.completed);

  useEffect(() => {
    const hasIncomplete = tasks.some(task => !task.completed);
    if (hasIncomplete && activeGroup === null) {
      setActiveGroup(groupName);
      setTimeout(() => {
        firstIncompleteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [tasks, activeGroup, groupName, setActiveGroup]);

  return (
    <div className="mb-12">
      <h2 className="tangerine text-5xl pb-8 pt-10">{title}</h2>

      <div className="flex gap-4 mb-4">
        {['all', 'completed', 'remaining'].map(option => (
          <button
            key={option}
            onClick={() => setFilter(option as 'all' | 'completed' | 'remaining')}
            className={`px-3 py-1 rounded ${
              filter === option ? 'bg-[#E4B441] text-white' : 'bg-gray-100'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-gray-500 italic mb-4">
          {filter === 'completed' && !hasCompleted && 'You have not yet completed any task.'}
          {filter === 'remaining' && !hasRemaining && 'You have completed all tasks.'}
        </div>
      )}

      <ul className="space-y-4">
        {filteredTasks.map((task, index) => {
          const isFirstIncomplete = !task.completed && tasks.findIndex(t => !t.completed) === index;

          return (
            <li
              key={task.id}
              ref={isFirstIncomplete ? firstIncompleteRef : null}
              className={`p-4 rounded border ${
                task.completed ? 'opacity-50 bg-gray-50' : 'bg-white'
              }`}
            >
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onTaskToggle(task.id)}
                  className="mt-3.5 scale-150 accent-[#E4B441]"
                />
                <div>
                  <p className='tangerine text-4xl mb-[4px]'>{task.text}</p>
                  <div>
                    {renderExtras && renderExtras(task)}
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
