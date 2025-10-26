"use client";
import Image from 'next/image';
import "../../styles/QuarterProjectCard.scss";



export default function QuarterProjectCard({ year = "", quarter = "", onClick = () => {} }) {
  return (
    <div className="relative w-full aspect-[10/1] my-2 sm:my-4 md:my-6 lg:my-8" onClick={onClick}>
      <Image
        src={`/projects/${year}/${quarter}_${year}_banner.svg`}
        alt={`${quarter} ${year} Banner`}
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
