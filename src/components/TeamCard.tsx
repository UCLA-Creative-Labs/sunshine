import React from "react";
import { Lato } from "next/font/google";
import Link from "next/link";

const lato = Lato({ weight: "700", subsets: ["latin"] });

interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
  link?: string;
}

interface TeamCardProps {
  data: Person;
}

function TeamCard(props: TeamCardProps): JSX.Element {
  const image = (
    <div className="w-56 h-56 aspect-w-1 aspect-h-1 mb-4">
      <img
        className="object-cover w-full h-full"
        src={props.data.image}
        alt={props.data.name}
      />
    </div>
  );

  return (
    <div className="mb-8">
      {props.data.link ? (
        <a
          href={props.data.link}
          target="_blank"
          rel="noreferrer"
          data-tip
          data-for={props.data.name}
        >
          {image}
        </a>
      ) : (
        image
      )}
      <h3 className="mt-2 mb-2 font-bold text-2xl text-black">
        {props.data.name}
      </h3>
      <p className="my-1 text-lg text-black">{`CLASS OF ${props.data.class}`}</p>
      {props.data.roles.map((role) => (
        <p
          className="my-1 text-lg text-black"
          key={props.data.name + "_" + role}
        >
          — {role}
        </p>
      ))}
    </div>
  );
}

export default TeamCard;
