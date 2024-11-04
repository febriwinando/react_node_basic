// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className='container bg-info'>
            <h1 style={{ color: 'white' }}>Sistem Informasi</h1>
            <ul style={{ listStyleType: 'none', display: 'flex', gap: '1rem' }}>
                <li>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                </li>
                <li>
                    <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
                </li>
                <li>
                    <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
