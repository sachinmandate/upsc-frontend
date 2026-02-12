import React from 'react';
import { Home, Users, BookOpen, UserCircle, LogOut } from 'lucide-react';

const navItems = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'subjects', label: 'Classes & Subjects', icon: BookOpen },
  { key: 'profile', label: 'Profile', icon: UserCircle },
];

const Sidebar = ({ activeKey, onNavigate }) => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
          <BookOpen className="h-6 w-6 text-gray-900" />
          <span className="text-lg font-semibold tracking-tight text-gray-900">UPSC Portal</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="px-3 pb-6">
        <button
          onClick={() => onNavigate('logout')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;