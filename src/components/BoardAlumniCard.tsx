import React from "react";
import { Lato } from "next/font/google";

const lato = Lato({ weight: "700", subsets: ["latin"] });

interface PersonCardProps {
  name: string;
  position: string;
  quote: string;  
  image: string;
  contact?: string; // Only for alumni
}

export default function PersonCard({ name, position, quote, image, contact }: PersonCardProps): React.JSX.Element {
  return (
    <div className="border-2 border-black rounded-2xl p-6 flex flex-col items-center text-center shadow-md w-full">
      {/* Circular Profile Picture */}
      <div className="w-24 h-24 overflow-hidden rounded-full mb-4 border-2 border-black">
        <img className="object-cover w-full h-full" src={image} />
      </div>

      {/* Name & Position */}
      <h2 className={`text-xl font-bold ${lato.className}`}>{name}</h2>
      <p className="text-sm text-gray-600 mb-2">{position}</p>

      {/* Quote */}
      <p className="italic text-lg">"{quote}"</p>

      {/* Contact Info for Alumni */}
      {contact && (
        <p className="text-sm text-gray-600 font-semibold mt-4">{contact}</p>
      )}
    </div>
  );
}
