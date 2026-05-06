import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import StarField from '../StarField';
import './Layout.css';

export default function Layout({ year, onYearChange }) {
  return (
    <>
      <StarField />
      <NavBar year={year} onYearChange={onYearChange} />
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
}
