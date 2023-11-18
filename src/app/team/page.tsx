import DropdownMenu from "@/components/DropdownMenu";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";


export default function Team() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex justify-center py-10 h-screen">
        <DropdownMenu
          className="flex flex-col w-[200px] text-xl"
          buttonClassName="p-4 px-4 bg-white border border-gray-300 border-[1.5px] focus:border-blue-300" 
          menuClassName="bg-white mt-1 text-center drop-shadow-md"
          label="All Years">
          <div className="flex flex-col">
            <button className="py-2 hover:bg-blue-100 border border-[1.5px] border-b-0 border-gray">
              2023
            </button>
            <button className="py-2 hover:bg-blue-100 border border-[1.5px] border-b-0 border-gray">
              2022
            </button>
            <button className="py-2 hover:bg-blue-100 border border-[1.5px] border-gray">
              2021
            </button>
          </div>
        </DropdownMenu>
      </div>
      <Footer />
    </main>
  );
}
