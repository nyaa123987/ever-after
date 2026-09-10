export type Message = {
  id: string;
  wedding_id: string;
  channel: 'partner' | 'group';
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
};
