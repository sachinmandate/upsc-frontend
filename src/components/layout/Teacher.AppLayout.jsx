import React from 'react';
import Sidebar from './Teacher.Sidebar';
import Navbar from './Teacher.Navbar';

const pageTitles = {
  home: 'Dashboard',
  students: 'Students',
  subjects: 'Classes & Subjects',
  profile: 'Profile',
};

const AppLayout = ({ activeKey, onNavigate, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeKey={activeKey} onNavigate={onNavigate} />
      <div className="ml-64">
        <Navbar title={pageTitles[activeKey] || 'Dashboard'} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;