import { Lato } from "next/font/google";
import Link from "next/link";

const lato = Lato({ weight: "700", subsets: ["latin"] });

interface UpcomingEventsCardProps {
  title: string;
  eventTime: string;
  location: string;
  description: string;
  imgSrc?: string;
  className?: string;
  href?: string;
}

export default function UpcomingEventsCard({
  title,
  eventTime,
  location,
  description,
  imgSrc = "/card_icons/what-we-do.svg",
  className = "",
  href = "/",
}: UpcomingEventsCardProps) {
  return (
    <div
      className={`flex flex-row items-stretch space-x-4 group border border-black p-8 shadow-lg transition ease-in-out delay-50 duration-300 ${className}`}
    >
      <div className="w-1/3 flex-shrink-0 flex items-center justify-center">
        <img
          alt="Event Icon"
          src={imgSrc}
          className="w-full h-full object-contain group-hover:scale-125 transition ease-in-out duration-500"
          style={{ maxHeight: "200px", maxWidth: "200px" }} 
        />
      </div>

      <div className="">
        <h1 className={`text-3xl ${lato.className}`}>{title}</h1>
        <div className="text-lg space-y-2">
          <p>
            <strong>Event Time:</strong> {eventTime}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
        </div>
      </div>
    </div>
  );
}
