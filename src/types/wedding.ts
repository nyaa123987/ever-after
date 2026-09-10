export type Role = 'owner' | 'partner' | 'collaborator';

export type Profile = {
  id: string;
  name: string;
  email: string;
  gender?: string | null;
  age?: number | null;
  created_at?: string;
};

export type Wedding = {
  id: string;
  owner_id: string;
  partner_name: string | null;
  wedding_date: string | null;
  budget: number | null;
  city: string | null;
  created_at?: string;
};

export type WeddingMember = {
  id: string;
  wedding_id: string;
  user_id: string;
  role: Role;
  status: 'pending' | 'accepted';
  created_at?: string;
  profile?: Profile;
};

export type Invite = {
  id: string;
  wedding_id: string;
  invited_by: string | null;
  name: string | null;
  email: string;
  role: 'partner' | 'collaborator';
  status: 'pending' | 'accepted';
  created_at?: string;
};

export const CITY_OPTIONS = [
  'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Epworth', 'Kwekwe',
  'Kadoma', 'Masvingo', 'Chinhoyi', 'Marondera', 'Norton', 'Chegutu', 'Bindura',
  'Beitbridge', 'Victoria Falls', 'Hwange', 'Rusape', 'Chiredzi', 'Kariba',
  'Karoi', 'Gwanda', 'Zvishavane', 'Redcliff', 'Shurugwi', 'Chipinge',
] as const;
export type City = (typeof CITY_OPTIONS)[number];
