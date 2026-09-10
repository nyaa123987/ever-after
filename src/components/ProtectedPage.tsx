import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useWedding } from '@/lib/WeddingContext';

export default function ProtectedPage({ children }: { children: ReactNode }) {
  const { loading, user, wedding } = useWedding();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !wedding)) {
      router.push('/auth');
    }
  }, [loading, user, wedding, router]);

  if (loading || !user || !wedding) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E4B441] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
