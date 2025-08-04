import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const useSourceLogout = (expectedSource: string = 'password') => {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const logoutParam = searchParams.get('logout');
  const shouldLogout = source === expectedSource && logoutParam !== 'false';

  useEffect(() => {
    if (shouldLogout) {
      supabase.auth.signOut();
    }
  }, [shouldLogout]);
};

export default useSourceLogout; 