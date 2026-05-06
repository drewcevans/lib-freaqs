import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Arrivals from './pages/Arrivals';
import Packing from './pages/Packing';
import Meals from './pages/Meals';
import Schedule from './pages/Schedule';
import BuildCrew from './pages/BuildCrew';
import Sets from './pages/Sets';
import SecretSets from './pages/SecretSets';
import { DEFAULT_YEAR } from './config/sheets';

export default function App() {
  const [year, setYear] = useState(DEFAULT_YEAR);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout year={year} onYearChange={setYear} />}>
          <Route index       element={<Arrivals year={year} />} />
          <Route path="packing"  element={<Packing year={year} />} />
          <Route path="meals"    element={<Meals year={year} />} />
          <Route path="schedule" element={<Schedule year={year} />} />
          <Route path="build"    element={<BuildCrew year={year} />} />
          <Route path="sets"     element={<Sets year={year} />} />
          <Route path="secrets"  element={<SecretSets year={year} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
