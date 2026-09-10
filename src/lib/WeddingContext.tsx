import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { Profile, Wedding, WeddingMember, Role } from '../types/wedding';

type WeddingContextValue = {
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  wedding: Wedding | null;
  role: Role | null;
  members: WeddingMember[];
  isEditor: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const WeddingContext = createContext<WeddingContextValue>({
  loading: true, user: null, profile: null, wedding: null, role: null,
  members: [], isEditor: false, refresh: async () => {}, signOut: async () => {},
});

export function useWedding() {
  return useContext(WeddingContext);
}

async function acceptPendingInvites(user: User) {
  if (!user.email) return;
  const { data: pending } = await supabase
    .from('invites').select('*').eq('email', user.email).eq('status', 'pending');
  if (!pending || pending.length === 0) return;

  for (const invite of pending) {
    const { error: memberError } = await supabase.from('wedding_members').insert([{
      wedding_id: invite.wedding_id, user_id: user.id, role: invite.role, status: 'accepted',
    }]);
    if (!memberError || memberError.code === '23505') {
      await supabase.from('invites').update({ status: 'accepted' }).eq('id', invite.id);
    }
  }
}

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [members, setMembers] = useState<WeddingMember[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null); setProfile(null); setWedding(null); setRole(null); setMembers([]);
      setLoading(false);
      return;
    }

    setUser(authUser);
    await acceptPendingInvites(authUser);

    const { data: profileRow } = await supabase
      .from('profiles').select('*').eq('id', authUser.id).maybeSingle();
    setProfile(profileRow ?? null);

    const { data: membership } = await supabase
      .from('wedding_members').select('*').eq('user_id', authUser.id).eq('status', 'accepted').maybeSingle();

    if (!membership) {
      setWedding(null); setRole(null); setMembers([]);
      setLoading(false);
      return;
    }

    setRole(membership.role as Role);

    const { data: weddingRow } = await supabase
      .from('weddings').select('*').eq('id', membership.wedding_id).maybeSingle();
    setWedding(weddingRow ?? null);

    const { data: memberRows } = await supabase
      .from('wedding_members').select('*, profile:profiles(*)').eq('wedding_id', membership.wedding_id);
    setMembers((memberRows as unknown as WeddingMember[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { load(); });
    return () => subscription.unsubscribe();
  }, [load]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null); setWedding(null); setRole(null); setMembers([]);
  }, []);

  const isEditor = role === 'owner' || role === 'partner';

  const value = useMemo(
    () => ({ loading, user, profile, wedding, role, members, isEditor, refresh: load, signOut }),
    [loading, user, profile, wedding, role, members, isEditor, load, signOut]
  );

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}
