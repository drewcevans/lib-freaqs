import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import LaserShow from '../LaserShow';
import './Layout.css';

export default function Layout() {
  return (
    <>
      <LaserShow />
      <NavBar />
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
}
