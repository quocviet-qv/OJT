import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../js/firebase-config';
import { getCurrentUser } from '../firebase/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getCurrentUser(nextUser.uid);
        setUserProfile(profile);
      } catch (err) {
        console.error('useAuth: failed to load user profile', err);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, userProfile, loading };
}
