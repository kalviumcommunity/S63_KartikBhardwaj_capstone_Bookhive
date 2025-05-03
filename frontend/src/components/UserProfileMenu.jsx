import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfileMenu.css';

const menuItems = [
  {
    label: 'My Profile',
    icon: (
      <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/></svg>
    ),
    to: '/profile',
  },
  {
    label: 'My Reviews',
    icon: (
      <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8M8 12h5"/></svg>
    ),
    to: '/my-reviews',
  },
  {
    label: 'Bookmarks',
    icon: (
      <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M6 4a2 2 0 0 0-2 2v14l8-5 8 5V6a2 2 0 0 0-2-2z"/></svg>
    ),
    to: '/bookmarks',
  },
];

const UserProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleMenuClick = (to) => {
    setOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    setOpen(false);
    // Add your logout logic here
    navigate('/login');
  };

  return (
    <div className="user-profile-menu-wrapper" ref={menuRef}>
      <button className="profile-icon-btn" onClick={() => setOpen((o) => !o)}>
        <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/></svg>
      </button>
      {open && (
        <div className="user-profile-dropdown">
          {menuItems.map((item) => (
            <div
              className="user-profile-menu-item"
              key={item.label}
              onClick={() => handleMenuClick(item.to)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
          <div className="user-profile-menu-divider" />
          <div className="user-profile-menu-item logout" onClick={handleLogout}>
            <svg width="22" height="22" fill="none" stroke="#e74c3c" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/><path d="M12 19a7 7 0 1 1 0-14"/></svg>
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu; 