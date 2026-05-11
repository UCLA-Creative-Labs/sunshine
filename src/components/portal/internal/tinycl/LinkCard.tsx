'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/lib/supabase/linksService';
import { RxDotsVertical, RxDragHandleDots2 } from "react-icons/rx";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

export default function LinkCard({ link, onEdit, onDelete, dragHandleProps }: LinkCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full group flex items-center gap-2">
      {/* Drag Handle */}
      <div 
        {...dragHandleProps}
        className="p-2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors"
      >
        <RxDragHandleDots2 size={24} />
      </div>

      <div className="relative flex-1">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-8 py-5 bg-white border border-[#c8d0d8] rounded-md text-center text-lg font-medium text-[#1a1a1a] no-underline cursor-pointer transition-all hover:shadow-lg hover:-translate-y-px"
        >
          {link.display_name}
        </a>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10" ref={menuRef}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 bg-transparent border-none cursor-pointer text-[#9ca3af] rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          >
            <RxDotsVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] min-w-[120px] py-1 overflow-hidden animate-in fade-in zoom-in duration-100">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(link);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left bg-none border-none text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(link.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left bg-none border-none text-sm font-medium text-red-600 cursor-pointer hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
