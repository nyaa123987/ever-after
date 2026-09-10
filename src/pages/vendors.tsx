'use client';

import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import H1 from '../components/Heading1';
import ProtectedPage from '../components/ProtectedPage';

const vendorCategories = [
  { name: 'Wedding Planners', path: '/vendors/wedding-planners' },
  { name: 'Venues', path: '/vendors/venues' },
  { name: 'Caterers', path: '/vendors/caterers' },
  { name: 'Videographers', path: '/vendors/videographers' },
  { name: 'Beauticians', path: '/vendors/beauticians' },
  { name: 'Photographers', path: '/vendors/photographers' },
  { name: 'Florists', path: '/vendors/florists' },
  { name: 'Musicians', path: '/vendors/musicians' },
  { name: "DJ's", path: '/vendors/djs' },
  { name: 'Cake Designers', path: '/vendors/cake-designers' },
  { name: 'Bridal Wear', path: '/vendors/bridal-wear' },
  { name: 'Groom Wear', path: '/vendors/groom-wear' },
  { name: 'Jewelry', path: '/vendors/jewelry' },
  { name: 'Bridal Shoes', path: '/vendors/bridal-shoes' },
  { name: 'Groom Shoes', path: '/vendors/groom-shoes' },
  { name: 'Invitations', path: '/vendors/invitations' },
  { name: 'Rental Services', path: '/vendors/rental-services' }, //tables, chairs, linens, transportation
];

function VendorsContent() {
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  return (
    <main
      className="min-h-screen py-10 px-5 flex flex-col items-center"
      style={{
        backgroundImage: "url('images/vendors-hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <H1>Vendors</H1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {vendorCategories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleClick(category.path)}
              className="flex items-center justify-center w-40 h-40 md:w-52 md:h-52 bg-transparent rounded-full shadow-2xl cursor-pointer border-2 border-[gray] 
                        transform transition-transform duration-300 hover:-translate-y-3 hover:scale-105"
            >
              <span className="text-xl md:text-2xl font-semibold text-center">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function VendorsPage() {
  return (
    <ProtectedPage>
      <VendorsContent />
    </ProtectedPage>
  );
}
