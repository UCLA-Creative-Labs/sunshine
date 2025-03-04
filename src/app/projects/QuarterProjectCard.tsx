"use client";
import Image from 'next/image';
import fallBanner from "@/assets/fall-2023-banner.png";
import "../../styles/QuarterProjectCard.scss";
import { useState } from "react";


export default function QuarterProjectCard({ year = "", quarter = "" }) {
  const imageSrc = `/${quarter}_${year}_banner.svg`;

  const [isOpen, setIsOpen] = useState(false);
  const bulletPoints = ["Point 1", "Point 2", "Point 3"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="quarter-project-card my-2 sm:my-4 md:my-6 lg:my-8">
      <div className="image-container relative w-full aspect-[10/1]" onClick={toggleDropdown}>
        <Image
          src={imageSrc}
          alt={`${quarter} ${year} Banner`}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      {isOpen && (
        <div className="dropdown-content" style={{ position: "static", marginTop: "1rem", marginBottom: "1rem" }}>
          <ul>
            {bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
