import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import H1 from './Heading1';
import Toast from './Toast';
import { Vendor, PRICING_DISCLAIMER } from '../data/vendorTypes';
import { supabase } from '../lib/supabaseClient';
import { useWedding } from '../lib/WeddingContext';
import { categoryBudget, fitForBudget, formatUSD } from '../lib/budget';

const FIT_LABEL: Record<string, string> = {
  fits: 'Fits your budget',
  stretch: 'A bit of a stretch',
  over: 'Above your budget',
  neutral: '',
};

const FIT_COLOR: Record<string, string> = {
  fits: 'bg-green-100 text-green-700',
  stretch: 'bg-yellow-100 text-yellow-700',
  over: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-600',
};

type Props = {
  title: string;
  category: string; // matches CATEGORY_BUDGET_SHARE key, e.g. 'venues'
  vendors: Vendor[];
};

export default function VendorCategoryPage({ title, category, vendors }: Props) {
  const router = useRouter();
  const { wedding, isEditor } = useWedding();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchSaved = useCallback(async () => {
    if (!wedding) return;
    const { data } = await supabase
      .from('saved_items')
      .select('vendor_id')
      .eq('wedding_id', wedding.id)
      .eq('category', category);
    setSavedIds(new Set((data ?? []).map((r) => r.vendor_id)));
  }, [wedding, category]);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  const budgetForCategory = categoryBudget(wedding?.budget ?? null, category);
  const isOutOfCity = wedding?.city && wedding.city !== 'Harare';

  const sorted = [...vendors].sort((a, b) => {
    const fitOrder = { fits: 0, stretch: 1, over: 2, neutral: 3 } as const;
    const fa = fitForBudget(budgetForCategory, a.estimatedCost);
    const fb = fitForBudget(budgetForCategory, b.estimatedCost);
    return fitOrder[fa] - fitOrder[fb];
  });

  const toggleSave = async (vendor: Vendor) => {
    if (!wedding) return;
    const vendorId = String(vendor.id);
    if (savedIds.has(vendorId)) {
      await supabase
        .from('saved_items')
        .delete()
        .eq('wedding_id', wedding.id)
        .eq('category', category)
        .eq('vendor_id', vendorId);
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(vendorId);
        return next;
      });
      flashToast('Removed from saved items.');
    } else {
      await supabase.from('saved_items').insert([
        { wedding_id: wedding.id, category, vendor_id: vendorId, vendor_name: vendor.name },
      ]);
      setSavedIds((prev) => new Set(prev).add(vendorId));
      flashToast('Saved!');
    }
  };

  const handleBook = async (vendor: Vendor) => {
    if (!wedding) return;
    await supabase.from('bookings').insert([
      {
        wedding_id: wedding.id,
        category,
        vendor_id: String(vendor.id),
        vendor_name: vendor.name,
        vendor_contact: vendor.contact,
        message: `Booking request for ${vendor.name} sent via Ever After.`,
        status: 'requested',
      },
    ]);
    flashToast(`Booking request logged for ${vendor.name}. Reach out via their contact details to confirm.`);
  };

  const contactVendor = (vendor: Vendor) => {
    const emailMatch = vendor.contact.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (emailMatch) {
      window.open(`mailto:${emailMatch[0]}?subject=${encodeURIComponent('Wedding inquiry via Ever After')}`, '_blank');
    } else {
      flashToast(`No email on file — contact them directly: ${vendor.contact}`);
    }
  };

  return (
    <main className="min-h-screen py-10 px-5 bg-gray-50">
      <button onClick={() => router.push('/vendors')} className="mb-5 p-2 rounded-full hover:bg-gray-200">
        ← Back to Vendors
      </button>

      <H1>{title}</H1>

      {budgetForCategory !== null && (
        <p className="text-center text-sm text-gray-600 mb-2">
          Suggested budget for this category: <strong>{formatUSD(budgetForCategory)}</strong>
        </p>
      )}
      {isOutOfCity && (
        <p className="text-center text-xs text-amber-600 mb-4 max-w-xl mx-auto">
          Heads up: these listings are currently curated for Harare. We don&apos;t have verified {wedding?.city} vendors
          yet — several of these do travel outside Harare, so it&apos;s worth reaching out directly.
        </p>
      )}
      <p className="text-center text-xs text-gray-400 mb-6">{PRICING_DISCLAIMER}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((vendor) => {
          const fit = fitForBudget(budgetForCategory, vendor.estimatedCost);
          const isSaved = savedIds.has(String(vendor.id));
          return (
            <div key={vendor.id} className="border p-4 rounded shadow bg-white flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-xl font-semibold">{vendor.name}</h2>
                {wedding && (
                  <button
                    onClick={() => toggleSave(vendor)}
                    className={`text-xs px-2 py-1 rounded ${isSaved ? 'bg-[#B85042] text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>

              {fit !== 'neutral' && (
                <span className={`inline-block w-fit text-xs px-2 py-0.5 rounded-full mb-2 ${FIT_COLOR[fit]}`}>
                  {FIT_LABEL[fit]}
                </span>
              )}

              <p className="text-gray-700 mb-1">{vendor.description}</p>
              <p className="text-gray-600 mb-1"><strong>Offerings:</strong> {vendor.offerings}</p>
              <p className="text-gray-600 mb-1"><strong>Location:</strong> {vendor.location}</p>
              <p className="text-gray-600 mb-1"><strong>Contact:</strong> {vendor.contact}</p>
              <p className="text-gray-800 font-medium mb-3">Estimated cost: {vendor.priceRange}</p>

              <div className="mt-auto flex gap-2">
                <button onClick={() => contactVendor(vendor)} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm">
                  Contact
                </button>
                {isEditor && (
                  <button onClick={() => handleBook(vendor)} className="flex-1 bg-[#B85042] text-white py-2 px-4 rounded hover:bg-[#A03F37] transition text-sm">
                    Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast && <Toast message={toast} />}
    </main>
  );
}
