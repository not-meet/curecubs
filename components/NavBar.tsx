"use client"
import React, { useState } from 'react';
import { FileText, MessageSquare, Pill, FileBarChart, Home } from 'lucide-react';
import HeaderProfileBtn from '@/app/(root)/_components/HeaderProfileBtn';
import Link from 'next/link';

const GlassNavbar = () => {
  const [activeItem, setActiveItem] = useState('Dr-near-me');

  const navItems = [
    { id: 'Dr-near-me', label: 'Dr Near Me', icon: <FileText className="w-5 h-5" /> },
    { id: 'talk-to-therapist', label: 'Talk to Therapist', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'get-medicine', label: 'Get Medicine', icon: <Pill className="w-5 h-5" /> },
    { id: 'check-reports', label: 'Check Reports', icon: <FileBarChart className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 w-auto">
      <nav className="backdrop-blur-md bg-white/20 border border-white/30 rounded-full shadow-lg">
        <div className="px-6 py-3 flex items-center space-x-2">
          {/* Home Button */}
          <Link href="/">
            <div className="bg-white/90 rounded-full flex items-center justify-center mr-4 w-10 h-10 shadow-md border border-white/50 hover:bg-white/70 transition-colors duration-300">
              <Home className="w-5 h-5 text-[#084A6D]" />
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${activeItem === item.id
                    ? 'bg-[#084A6D]/70 text-white shadow-md'
                    : 'hover:bg-white/30 text-[#084A6D]'
                  }`}
                onClick={() => setActiveItem(item.id)}
              >
                <div className={`transition-transform duration-300 ${activeItem === item.id ? 'scale-110' : 'scale-100'
                  }`}>
                  {item.icon}
                </div>
                <span className="ml-2 text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          <HeaderProfileBtn />
        </div>
      </nav>
    </div>
  );
};

export default GlassNavbar;
