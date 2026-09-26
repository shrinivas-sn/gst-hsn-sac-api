import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span>GST HSN/SAC API</span>
          <span className="brand-badge">v1.0</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/playground" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Playground
          </NavLink>
          <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Docs
          </NavLink>
          <NavLink to="/status" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Status
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
