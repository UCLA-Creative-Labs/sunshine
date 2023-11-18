"use client";

import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

export default function DropdownMenu({ className, buttonClassName, menuClassName, label, children } 
    : { className?: string, buttonClassName?: string, menuClassName?: string, label?: string, children?: React.ReactNode }) {
    const [enabled, setEnabled] = useState<boolean>(false);
    const dropdownRef = useRef<any>(null);

    const handleOutsideClick = (e: Event) => {
        if (dropdownRef.current && enabled && !dropdownRef.current.contains(e.target)) {
            setEnabled(false);
        }
    }
        
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [enabled]);

    return (
        <div className={className} ref={dropdownRef}>
            <button className={`${buttonClassName} flex items-center justify-between ${enabled ? 'rounded-t-xl rounded-b-none' : 'rounded-xl'}`} onClick={() => { setEnabled(!enabled); }}>
                <h1>
                    {label}
                </h1> 
                <FaAngleDown className="mt-1"/>
            </button>
            <div className={`z-10 ${enabled ? 'block' : 'hidden'} ${menuClassName}`}>
                {children}
            </div>
        </div>
    )
}