import { createContext, useContext, useState, useCallback } from 'react';

const KEY = 'libfreaqs_identity';
const Ctx = createContext(null);

export function IdentityProvider({ children }) {
  const [identity, setRaw] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; }
    catch { return null; }
  });

  const setIdentity = useCallback((data) => {
    if (data) localStorage.setItem(KEY, JSON.stringify(data));
    else localStorage.removeItem(KEY);
    setRaw(data || null);
  }, []);

  return <Ctx.Provider value={{ identity, setIdentity }}>{children}</Ctx.Provider>;
}

export const useIdentity = () => useContext(Ctx);
