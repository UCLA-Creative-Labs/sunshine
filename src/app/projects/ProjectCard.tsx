import { Lato } from "next/font/google"
import Image from 'next/image';

import '../../styles/ProjectsContent.scss';


const lato = Lato({ weight: '700', subsets: ['latin'] })

export default function ProjectCard({ title, description, img, alt = "", url = "" }) {

    return (
        <div className="flex flex-col proj-card">
            <Image
            className="project-image"
            src={img}
            alt={alt}
            layout="responsive" /* Ensures the image scales based on its container */
            width={5} /* Set the aspect ratio width */
            height={3} /* Set the aspect ratio height */
            />
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-lg">{description}</p>
        </div>
    )
}