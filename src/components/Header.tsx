import { Car } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Car className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Vroomie</h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};