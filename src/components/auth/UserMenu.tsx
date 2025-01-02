import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}