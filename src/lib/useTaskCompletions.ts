import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useTaskCompletions(weddingId: string | null) {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!weddingId) return;
    const { data } = await supabase
      .from('task_completions')
      .select('task_key, completed')
      .eq('wedding_id', weddingId);

    const map: Record<string, boolean> = {};
    (data ?? []).forEach((row) => { map[row.task_key] = row.completed; });
    setCompletions(map);
    setLoaded(true);
  }, [weddingId]);

  useEffect(() => { load(); }, [load]);

  const toggle = useCallback(async (taskKey: string) => {
    if (!weddingId) return;
    const nextValue = !completions[taskKey];
    setCompletions((prev) => ({ ...prev, [taskKey]: nextValue }));

    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('task_completions').upsert(
      {
        wedding_id: weddingId,
        task_key: taskKey,
        completed: nextValue,
        completed_by: user?.id ?? null,
        completed_at: nextValue ? new Date().toISOString() : null,
      },
      { onConflict: 'wedding_id,task_key' }
    );
  }, [weddingId, completions]);

  return { completions, toggle, loaded, refresh: load };
}
