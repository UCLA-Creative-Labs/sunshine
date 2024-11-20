import Image from 'next/image';
import Link from 'next/link';

import '../../styles/ProjectsContent.scss';

export default function ProjectCard({
    title,
    description,
    img,
    alt = '',
    url = '',
}) {
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
    );
}
