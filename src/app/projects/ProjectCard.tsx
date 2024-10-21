import { Lato } from "next/font/google"

const lato = Lato({ weight: '700', subsets: ['latin'] })

export default function ProjectCard({ title, description, url }) {

    return (
        <div className="flex flex-col">
            <img />
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-lg">{description}</p>
        </div>
    )
}