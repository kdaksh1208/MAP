import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-sky-500 text-white flex items-center justify-center font-bold">
          FB
        </div>
        <div>
          <h1 className="text-lg font-semibold">Flowbit - AOI Creator</h1>
          <p className="text-sm text-gray-500">Frontend Engineer Internship - Demo</p>
        </div>
      </div>
      <div>
        <button className="px-3 py-1 rounded bg-slate-100 border">Profile</button>
      </div>
    </header>
  );
}
