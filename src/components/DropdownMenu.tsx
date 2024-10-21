"use client";

import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

export default function DropdownMenu({ className, buttonClassName, menuClassName, menuButtonClassName, menuButtonHoverColor, options, setValue } 
    : { className?: string, buttonClassName?: string, menuClassName?: string, menuButtonClassName?: string, menuButtonHoverColor?: string, options: Array<string>, setValue?: any }) {
    const [enabled, setEnabled] = useState<boolean>(false);
    const dropdownRef = useRef<any>(null);
    const [selectedValue, setSelectedValue] = useState<string|undefined>(options?.at(0));

    const handleOutsideClick = (e: Event) => {
        if (dropdownRef.current && enabled && !dropdownRef.current.contains(e.target)) {
            setEnabled(false);
        }
    }

    const handleEsc = (e: KeyboardEvent) => {
        if (dropdownRef.current && enabled && e.key === "Escape")
            setEnabled(false);
    }
        
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [enabled]);

    return (
        <div className={`${className} relative`} ref={dropdownRef}>
            <button className={`${buttonClassName} flex items-center justify-between ${enabled ? 'rounded-t-xl rounded-b-none' : 'rounded-xl'}`} onClick={() => { setEnabled(!enabled); }}>
                <h1>
                    {selectedValue}
                </h1> 
                {enabled ? <FaAngleUp className="mt-1"/> : <FaAngleDown className="mt-1"/>}
            </button>
            <div className={`top-full flex flex-col z-10 absolute ${enabled ? 'block' : 'hidden'} ${menuClassName}`}>
                {options.map((_, idx) => 
                    <button 
                        className={`${menuButtonClassName} ${options.at(idx) == selectedValue ? menuButtonHoverColor : ''}`}
                        key={idx}
                        onClick={() => {setSelectedValue(options.at(idx)); setEnabled(false); if (setValue) setValue(options.at(idx));}}
                    >
                        {options.at(idx)}
                    </button>)}
            </div>
        </div>
    )
}