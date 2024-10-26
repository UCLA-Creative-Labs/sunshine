import { Lato } from "next/font/google"
import Image from 'next/image';
import Link from "next/link";


import '../../styles/ProjectsContent.scss';


const lato = Lato({ weight: '700', subsets: ['latin'] })

export default function ProjectCard({ title, description, img, alt = "", url = "" }) {

    return (
        <Link href={url}>
            <div className="flex flex-col proj-card">
                <Image
                className="project-image"
                src={img}
                alt={alt}
                layout="responsive" /* Ensures the image scales based on its container */
                width={5} 
                height={3} 
                />
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-lg">{description}</p>
            </div>
        </Link>
    )
}