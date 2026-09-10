import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import H1 from '@/components/Heading1';
import ProtectedPage from '@/components/ProtectedPage';
import { useWedding } from '@/lib/WeddingContext';
import { supabase } from '@/lib/supabaseClient';

type SavedItem = {
  id: string;
  category: string;
  vendor_id: string;
  vendor_name: string;
  created_at: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  venues: 'Venues',
  caterers: 'Caterers',
  'wedding-planners': 'Wedding Planners',
  photographers: 'Photographers',
  videographers: 'Videographers',
  'bridal-wear': 'Bridal Wear',
  'groom-wear': 'Groom Wear',
  jewelry: 'Jewelry',
  'bridal-shoes': 'Bridal Shoes',
  'groom-shoes': 'Groom Shoes',
  florists: 'Florists',
  musicians: 'Musicians',
  djs: "DJ's",
  'cake-designers': 'Cake Designers',
  invitations: 'Invitations',
  beauticians: 'Beauticians',
  'rental-services': 'Rental Services',
};

function SavedContent() {
  const { wedding } = useWedding();
  const [items, setItems] = useState<SavedItem[]>([]);

  const fetchItems = useCallback(async () => {
    if (!wedding) return;
    const { data } = await supabase
      .from('saved_items')
      .select('*')
      .eq('wedding_id', wedding.id)
      .order('created_at', { ascending: false });
    setItems((data as SavedItem[]) ?? []);
  }, [wedding]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const remove = async (id: string) => {
    await supabase.from('saved_items').delete().eq('id', id);
    fetchItems();
  };

  const grouped = items.reduce<Record<string, SavedItem[]>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="py-8 px-[4%] max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard"><ArrowLeft className="w-6 h-6 cursor-pointer" /></Link>
        <H1>Saved Items</H1>
        <div className="w-6" />
      </div>

      {items.length === 0 && (
        <p className="text-center text-gray-400 text-sm">
          Nothing saved yet — browse{' '}
          <Link href="/vendors" className="text-[#B85042] underline">Vendors</Link> and tap Save on
          anything you like.
        </p>
      )}

      {Object.entries(grouped).map(([category, categoryItems]) => (
        <div key={category} className="mb-6">
          <h2 className="font-semibold mb-2">{CATEGORY_LABELS[category] ?? category}</h2>
          <div className="space-y-2">
            {categoryItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-[#F5F5F5] p-3 rounded">
                <div>
                  <p>{item.vendor_name}</p>
                  <Link href={`/vendors/${category}`} className="text-xs text-[#B85042] underline">
                    View category
                  </Link>
                </div>
                <button onClick={() => remove(item.id)} className="text-red-500 text-xs hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SavedPage() {
  return (
    <ProtectedPage>
      <SavedContent />
    </ProtectedPage>
  );
}
