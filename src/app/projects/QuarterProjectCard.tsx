"use client";
import Image from 'next/image';
import fallBanner from "@/assets/fall-2023-banner.png";
import "../../styles/QuarterProjectCard.scss";



export default function QuarterProjectCard({ year = "", quarter = "" }) {
  const imageSrc = `/${quarter}_${year}_banner.svg`;

  return (
    <div className="relative w-full aspect-[10/1] my-2 sm:my-4 md:my-6 lg:my-8">
      <Image
        src={imageSrc}
        alt={`${quarter} ${year} Banner`}
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
