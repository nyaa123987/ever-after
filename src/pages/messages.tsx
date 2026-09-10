import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import H1 from '@/components/Heading1';
import ProtectedPage from '@/components/ProtectedPage';
import { useWedding } from '@/lib/WeddingContext';
import { supabase } from '@/lib/supabaseClient';
import { Message } from '@/types/message';

function MessagesContent() {
  const { wedding, members, isEditor, user } = useWedding();
  const [channel, setChannel] = useState<'partner' | 'group'>('partner');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasPartner = members.some((m) => m.role === 'partner');
  const hasCollaborators = members.some((m) => m.role === 'collaborator');
  const canUsePartnerChannel = isEditor;

  const nameFor = useCallback(
    (senderId: string) => members.find((m) => m.user_id === senderId)?.profile?.name ?? 'Someone',
    [members]
  );

  const fetchMessages = useCallback(async () => {
    if (!wedding) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('wedding_id', wedding.id)
      .eq('channel', channel)
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) ?? []);
  }, [wedding, channel]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  useEffect(() => {
    if (!wedding) return;
    const sub = supabase
      .channel(`messages-${wedding.id}-${channel}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `wedding_id=eq.${wedding.id}` }, (payload) => {
        const row = payload.new as Message;
        if (row.channel === channel) setMessages((prev) => [...prev, row]);
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [wedding, channel]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding || !user || !text.trim()) return;
    await supabase.from('messages').insert([{ wedding_id: wedding.id, channel, sender_id: user.id, content: text.trim() }]);
    setText('');
  };

  useEffect(() => {
    if (channel === 'partner' && !canUsePartnerChannel) setChannel('group');
  }, [canUsePartnerChannel, channel]);

  return (
    <div className="py-8 px-[4%] max-w-2xl mx-auto flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <Link href="/dashboard"><ArrowLeft className="w-6 h-6 cursor-pointer" /></Link>
        <H1>Messages</H1>
        <div className="w-6" />
      </div>

      <div className="flex gap-2 mb-4">
        {canUsePartnerChannel && (
          <button onClick={() => setChannel('partner')} className={`px-3 py-1 rounded text-sm ${channel === 'partner' ? 'bg-[#B85042] text-white' : 'bg-gray-200'}`}>Partner chat</button>
        )}
        {(hasCollaborators || hasPartner) && (
          <button onClick={() => setChannel('group')} className={`px-3 py-1 rounded text-sm ${channel === 'group' ? 'bg-[#B85042] text-white' : 'bg-gray-200'}`}>Group chat</button>
        )}
      </div>

      {!hasPartner && !hasCollaborators && (
        <p className="text-sm text-gray-500 mb-4">
          You haven&apos;t invited anyone yet. Head to <Link href="/members" className="text-[#B85042] underline">People</Link> to invite your partner or a helper, then come back here to chat.
        </p>
      )}

      <div className="flex-1 overflow-y-auto bg-[#F5F5F5] rounded-lg p-4 space-y-3 mb-4">
        {messages.length === 0 && <p className="text-center text-gray-400 text-sm">No messages yet — say hello!</p>}
        {messages.map((m) => {
          const isMine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${isMine ? 'bg-[#B85042] text-white' : 'bg-white text-gray-800 border'}`}>
                {!isMine && <p className="text-xs font-semibold mb-1 opacity-70">{nameFor(m.sender_id)}</p>}
                <p>{m.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B441]" />
        <button type="submit" className="bg-[#B85042] text-white px-5 py-2 rounded-full hover:bg-[#A03F37] transition">Send</button>
      </form>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedPage>
      <MessagesContent />
    </ProtectedPage>
  );
}
