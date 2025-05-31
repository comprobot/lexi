import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex border-t justify-between font-medium p-6">
      <div className="flex items-center gap-2">
        <p className="text-gray-500">
          &copy; {currentYear} {"Hien (Hanni) Dinh"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
