import { Lato } from "next/font/google"
import Link from "next/link"

const lato = Lato({ weight: '400', subsets: ['latin'] })

interface ProjectCardProps {
    title: string,
    imgSrc?: string,
    imgPos?: string,
    className?: string,
    href?: string
}

export default function ProjectCard({ title, imgSrc='/card_icons/what-we-do.svg', imgPos='top', className='', href='/' }: ProjectCardProps) {

    return (
        <Link href={href}
            className={`flex ${imgPos == 'top' ? 'flex-col space-y-8' : 'flex-row space-x-8 items-center'} group border border-black p-8 shadow-lg rounded-xl cursor-pointer transition ease-in-out delay-50 duration-300 ${className}`}
        >
            <div className="overflow-hidden rounded-xl shadow-lg">
                <img
                    alt="Card Icon"
                    src={imgSrc}
                    className="w-full group-hover:scale-125 transition ease-in-out duration-500"
                />
            </div>
            <div className="space-y-6 flex justify-center items-center">
                <div className="flex items-center space-x-2">
                    <h1
                        className={ `text-3xl ${lato.className}` }
                    >
                        {title}
                    </h1>
                    <span className="text-3xl group-hover:translate-x-2 transition-transform ease-in-out duration-300">➔</span>
                </div>
            </div>
        </Link>
    )
}