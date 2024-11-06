import React from "react";
import { Lato } from "next/font/google";

const lato = Lato({ weight: "700", subsets: ["latin"] });

interface BoardAlumniCardProps {
  quote: string;  
  image: string; 
}

export default function PersonCard({quote, image }: BoardAlumniCardProps): JSX.Element {
  return (
    <div className="flex flex-col items-center mb-8">
      {image && (
        <div className="w-32 h-32 overflow-hidden rounded-full mb-4">
          <img
            className="object-cover w-full h-full"
            src={image}
          />
        </div>
      )}
      <p className="italic text-center text-lg">"{quote}"</p>
    </div>
  );
}
