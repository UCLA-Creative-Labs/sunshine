"use client";

import Image from "next/image";
import Link from "next/link";
export default function Navbar() {
  return (
    <div
      id="navbar"
      className="transition z-50 ease-in-out delay-100 flex justify-between min-w-full p-8 lg:px-20 sticky top-0 bg-[#000000] text-white"
    >
      <div
        id="title"
        className="flex justify-center md:justify-between items-center min-w-full md:min-w-0"
      >
        <div className="flex items-center space-x-4">
          <Image
            alt="Creative Labs Logo"
            src="/cl-logo.svg"
            width={40}
            height={40}
            className="transition ease-in-out delay-100 invert"
          />
          <Link
            href="/"
            className={"text-xl tracking-widest " + "font-[family-name:var(--font-lato)] font-black"}
          >
            CREATIVE LABS
          </Link>
        </div>
      </div>
      <nav
        id="navigation"
        className="hidden md:flex divide-x-2 divide-white items-center [&>div]:pl-6 space-x-6"
      >
        <div id="links" className="flex space-x-6 lg:text-xl">
          <Link href="/about">ABOUT</Link>
          <Link href="/projects">PROJECTS</Link>
          <Link href="/team">OUR TEAM</Link>
        </div>
        <div id="join">
          <Link
            href="/join"
            className="lg:text-xl border-[3px] border-black rounded-xl py-2 md:px-6 bg-white text-black"
          >
            JOIN US
          </Link>
        </div>
      </nav>
    </div>
  );
}
