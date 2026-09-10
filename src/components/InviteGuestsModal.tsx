import { useMemo, useState } from 'react';
import { Guest } from '../types/guest';

type Props = {
  guests: Guest[];
  venue: string;
  weddingDate: string;
  onClose: () => void;
};

function fillTemplate(template: string, guest: Guest, venue: string, weddingDate: string) {
  return template
    .replaceAll('{name}', guest.name)
    .replaceAll('{party_size}', String(guest.max_guests ?? 1))
    .replaceAll('{venue}', venue || 'our venue (TBC)')
    .replaceAll('{wedding_date}', weddingDate || 'our wedding date (TBC)');
}

const DEFAULT_TEMPLATE = `Dear {name},

We're getting married and would love for you to be there! You're invited to bring up to {party_size} people in your party.

Venue: {venue}
Date: {wedding_date}

Please let us know if you can make it.

With love,
The Happy Couple`;

export default function InviteGuestsModal({ guests, venue, weddingDate, onClose }: Props) {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const withEmail = useMemo(() => guests.filter((g) => g.email), [guests]);
  const withoutEmail = useMemo(() => guests.filter((g) => !g.email), [guests]);

  const openMailDraft = (guest: Guest) => {
    const body = fillTemplate(template, guest, venue, weddingDate);
    const subject = encodeURIComponent("You're invited to our wedding!");
    window.open(`mailto:${guest.email}?subject=${subject}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-md w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-black text-xl">×</button>
        <h2 className="text-xl font-semibold mb-3">Invite your guests</h2>
        <p className="text-sm text-gray-500 mb-2">
          Customize the message below, then click Send next to each guest — it opens a ready-to-go
          email in your mail app. Placeholders: <code>{'{name}'}</code>, <code>{'{party_size}'}</code>,{' '}
          <code>{'{venue}'}</code>, <code>{'{wedding_date}'}</code>
        </p>
        <textarea value={template} onChange={(e) => setTemplate(e.target.value)} rows={8} className="border w-full p-2 mb-4 rounded text-sm font-mono" />

        <h3 className="font-semibold mb-2">Guests with an email ({withEmail.length})</h3>
        <div className="space-y-2 mb-4">
          {withEmail.length === 0 && <p className="text-sm text-gray-400">No guests with an email address yet.</p>}
          {withEmail.map((g) => (
            <div key={g.id} className="flex justify-between items-center bg-[#F5F5F5] p-2 rounded">
              <span className="text-sm">{g.name}</span>
              <button onClick={() => openMailDraft(g)} className="bg-[#B85042] text-white text-xs px-3 py-1 rounded">Send</button>
            </div>
          ))}
        </div>

        {withoutEmail.length > 0 && (
          <>
            <h3 className="font-semibold mb-2 text-red-600">No email on file ({withoutEmail.length}) — call them or send a card</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {withoutEmail.map((g) => (<li key={g.id}>{g.name}</li>))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
