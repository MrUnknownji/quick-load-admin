import React from "react";

interface HeaderProps {
  name: string;
  createdAt: string;
}

const Header: React.FC<HeaderProps> = ({ name, createdAt }) => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-20">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4">
        <div>
          <h1 className="text-2xl font-semibold">User Name({name})</h1>
          <p className="text-sm text-gray-500">
            account created on {createdAt}
          </p>
        </div>
        <div className="flex space-x-8 mt-4 md:mt-0">
          <button className="text-red-500 flex flex-col items-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Delete</span>
          </button>
          <button className="text-primary-600 flex flex-col items-center">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Verify</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
