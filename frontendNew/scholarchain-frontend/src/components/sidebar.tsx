"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`h-screen bg-gray-900 text-white fixed top-0 ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 p-5 flex flex-col`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" text-white bg-gray-800 rounded-md mb-5 self-end"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar Items */}
      <ul className="space-y-4">
        <li>
          <Link href="/" className="flex items-center space-x-3 hover:text-gray-300">
            <HomeIcon className="h-6 w-6" />
            {isOpen && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="flex items-center space-x-3 hover:text-gray-300">
            <ChartBarIcon className="h-6 w-6" />
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex items-center space-x-3 hover:text-gray-300">
            <CogIcon className="h-6 w-6" />
            {isOpen && <span>Settings</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
