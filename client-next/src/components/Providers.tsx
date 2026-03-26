'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';
import { AuthService } from '@/lib/api';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken(true);
          const response = await AuthService.firebaseLogin(idToken);
          setUser({
            id: '',                           // not returned by login — fetched lazily via /api/users/me
            email: response.userEmail,
            fullName: response.fullName,
            roles: response.roles ?? [],
            photoURL: currentUser.photoURL || undefined
          }, response.accessToken);
        } catch (error) {
          console.error("Failed to authenticate Firebase user with backend:", error);
          setUser(null, null);
        }
      } else {
        // Clear global state if Firebase logs out
        setUser(null, null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
