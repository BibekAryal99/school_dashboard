'use client';

import React from 'react';

const Navbar = () => {
  return (
    <header className="h-16 border-b bg-white px-6">
  <div className="flex h-full items-center w-full">
    <h2 className="text-lg font-semibold">
      Dashboard
    </h2>
    <div className="ml-auto flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
        A
      </div>
      <span className="text-sm font-medium">
        Admin
      </span>
    </div>
  </div>
</header>


  );
};

export default Navbar;
