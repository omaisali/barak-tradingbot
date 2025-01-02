import React from 'react';
import { validateEnv } from '../../config/env';

export default function AuthError() {
  const missingEnv = validateEnv();

  if (missingEnv.length === 0) return null;

  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Supabase Connection Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please click the "Connect to Supabase" button in the top right corner
              to set up your project's database connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}