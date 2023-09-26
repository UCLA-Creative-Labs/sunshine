import { Lato } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

const lato = Lato({ weight: '900', subsets: ['latin'] })

export default function Navbar() {
    return (
        <div 
            id="navbar" 
            className="flex justify-between min-w-full py-10 px-16 bg-[#85b6ff] dark:bg-[#000000]"
            style={{

            }}
        >
            <div id="title" className="flex items-center space-x-4">
                <Image
                    alt="Creative Labs Logo"
                    src="/cl-logo.svg"
                    width={40}
                    height={40}
                    className="dark:invert"
                />
                <Link 
                    href="/"
                    className={"text-2xl tracking-widest " + lato.className}>
                    CREATIVE LABS
                </Link>
            </div>
            <nav id="navigation" className="flex divide-x-[3px] divide-black dark:divide-white items-center [&>div]:pl-12 space-x-12">
                <div id="links" className="flex space-x-12">
                    <Link
                        href="/"
                        className="text-2xl p-0"
                    >
                        HOME
                    </Link>
                    <Link
                        href="/"
                        className="text-2xl"
                    >
                        ABOUT
                    </Link>
                    <Link
                        href="/"
                        className="text-2xl"
                    >
                        PROJECTS
                    </Link>
                </div>
                <div id="join">
                    <Link
                        href="/"
                        className="text-2xl border-[3px] border-black rounded-xl py-2 px-8 bg-white text-black"
                    >
                        JOIN US
                    </Link>
                </div>
            </nav>
        </div>  
        
    )
}