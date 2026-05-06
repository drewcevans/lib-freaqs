import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import LaserShow from '../LaserShow';
import './Layout.css';

export default function Layout({ year, onYearChange }) {
  return (
    <>
      <LaserShow />
      <NavBar year={year} onYearChange={onYearChange} />
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
}
