import Image from 'next/image';
import Link from "next/link";


import '../../styles/ProjectsContent.scss';


export default function YearProjectCard({ title, description, img, alt = "", url = "" }) {

    return (
      <Link href={url}>
        <div className="flex flex-col proj-card">
          <Image
            className="rounded-lg project-image"
            src={img}
            alt={alt}
            layout="responsive" /* Ensures the image scales based on its container */
            width={5}
            height={3}
          />
          <h1 className="text-3xl font-extrabold">{title}</h1>
        </div>
      </Link>
    );
}