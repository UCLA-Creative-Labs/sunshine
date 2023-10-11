'use client'

import { Lato } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react";

const lato = Lato({ weight: '900', subsets: ['latin'] });

const SCROLLY_POINT = 150;

export default function Navbar() {
    const [pastScrollPoint, setPastScrollPoint] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setPastScrollPoint(window.scrollY > SCROLLY_POINT);
        });
    })

    return (
        <div 
            id="navbar" 
            className={ `transition z-50 ease-in-out delay-100 flex justify-between min-w-full p-10 lg:px-20 dark:bg-[#000000] sticky top-0 ${pastScrollPoint ? 'bg-[#000000] text-white' : 'bg-[#85b6ff]'}` }
            style={{

            }}
        >
            <div id="title" className="flex justify-between items-center min-w-full lg:min-w-0">
                <div className="flex items-center space-x-4">
                    <Image
                        alt="Creative Labs Logo"
                        src="/cl-logo.svg"
                        width={40}
                        height={40}
                        className={ `transition ease-in-out delay-100 dark:invert ${pastScrollPoint && 'invert'}`}
                    />
                    <Link 
                        href="/"
                        className={"text-xl lg:text-2xl tracking-widest " + lato.className}>
                        CREATIVE LABS
                    </Link>
                </div>
            </div>
            <nav id="navigation" className="hidden lg:flex divide-x-2 divide-black dark:divide-white items-center [&>div]:pl-8 space-x-8">
                <div id="links" className="flex space-x-8 text-xl xl:text-2xl">
                    <Link
                        href="/"
                    >
                        ABOUT
                    </Link>
                    <Link
                        href="/"
                    >
                        PROJECTS
                    </Link>
                    <Link
                        href="/"
                    >
                        OUR TEAM
                    </Link>
                </div>
                <div id="join">
                    <Link
                        href="/"
                        className="text-xl xl:text-2xl border-[3px] border-black rounded-xl py-2 px-8 bg-white text-black"
                    >
                        JOIN US
                    </Link>
                </div>
            </nav>
        </div>  
        
    )
}