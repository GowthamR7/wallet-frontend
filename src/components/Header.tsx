import React from 'react';
import { Wallet } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wallet className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-tight">My Wallet Dashboard</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;