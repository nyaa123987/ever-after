import { Guest } from '../types/guest';

type GuestItemProps = {
  guest: Guest;
  onRemove: () => void;
  onEdit: () => void;
};

const GuestItem = ({ guest, onRemove, onEdit }: GuestItemProps) => (
  <div className="flex justify-between items-center bg-[#F5F5F5] p-2 rounded mb-2">
    <div>
      <p className="font-7xl">{guest.name}</p>
      {guest.email ? (
        <p className="text-medium text-gray-500">{guest.email}</p>
      ) : (
        <p className="text-xs text-red-500">No email — call them or send a physical invite</p>
      )}
      <p className="text-xs text-gray-400">Party size: {guest.max_guests ?? 1}</p>
    </div>
    <div className="flex gap-2">
      <button onClick={onEdit} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Edit</button>
      <button onClick={onRemove} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Remove</button>
    </div>
  </div>
);

export default GuestItem;
