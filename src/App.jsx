import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IdentityProvider, useIdentity } from './context/IdentityContext';
import Layout from './components/Layout/Layout';
import OnboardingModal from './components/OnboardingModal';
import Freaqs from './pages/Freaqs';
import Agenda from './pages/Agenda';
import WhatToBring from './pages/WhatToBring';
import FoodAndDrank from './pages/FoodAndDrank';
import Builders from './pages/Builders';
import CampMap from './pages/CampMap';
import SetList from './pages/SetList';
import Shh from './pages/Shh';
import { DEFAULT_YEAR } from './config/sheets';

function AppInner() {
  const [year, setYear] = useState(DEFAULT_YEAR);
  const { identity } = useIdentity();

  if (!identity) return <OnboardingModal year={year} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout year={year} onYearChange={setYear} />}>
          <Route index            element={<Freaqs year={year} />} />
          <Route path="agenda"    element={<Agenda year={year} />} />
          <Route path="bring"     element={<WhatToBring year={year} />} />
          <Route path="food"      element={<FoodAndDrank year={year} />} />
          <Route path="builders"  element={<Builders year={year} />} />
          <Route path="map"       element={<CampMap year={year} />} />
          <Route path="sets"      element={<SetList year={year} />} />
          <Route path="shh"       element={<Shh year={year} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <IdentityProvider>
      <AppInner />
    </IdentityProvider>
  );
}
