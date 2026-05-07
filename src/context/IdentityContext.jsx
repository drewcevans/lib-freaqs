import { createContext, useContext, useState, useCallback } from 'react';

const KEY = 'libfreaqs_identity';
const Ctx = createContext(null);

export function IdentityProvider({ children }) {
  const [identity, setRaw] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; }
    catch { return null; }
  });
  // true only when setIdentity was called this session (not loaded from storage on refresh)
  const [freshlyOnboarded, setFreshlyOnboarded] = useState(false);

  const setIdentity = useCallback((data) => {
    if (data) {
      localStorage.setItem(KEY, JSON.stringify(data));
      setFreshlyOnboarded(true);
    } else {
      localStorage.removeItem(KEY);
      setFreshlyOnboarded(false);
    }
    setRaw(data || null);
  }, []);

  return <Ctx.Provider value={{ identity, setIdentity, freshlyOnboarded }}>{children}</Ctx.Provider>;
}

export const useIdentity = () => useContext(Ctx);
