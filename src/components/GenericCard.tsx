import { Lato } from "next/font/google"
import Link from "next/link"

const lato = Lato({ weight: '700', subsets: ['latin'] })

interface GenericCardProps {
    title: string,
    description: string,
    imgSrc?: string,
    imgPos?: string,
    className?: string,
    href?: string
}

export default function GenericCard({ title, description, imgSrc='/card_icons/what-we-do.svg', imgPos='top', className='', href='/' }: GenericCardProps) {

    return (
        <Link href={href}
            className={`flex ${imgPos == 'top' ? 'flex-col space-y-8' : 'flex-row space-x-8 items-center'} group border border-black p-8 shadow-lg rounded-2xl cursor-pointer transition ease-in-out delay-50 duration-300 hover:-translate-y-5 ${className}`}
        >
            <div className="overflow-hidden rounded-xl shadow-lg">
                <img
                    alt="Card Icon"
                    src={imgSrc}
                    className="w-full group-hover:scale-125 transition ease-in-out duration-500"
                />
            </div>
            <div className="space-y-6">
                <div className="flex items-center space-x-2">
                    <h1
                        className={ `text-3xl ${lato.className}` }
                    >
                        {title}
                    </h1>
                    <h1 className={`text-3xl group-hover:translate-x-4 transition ease-in-out duration-100 delay-50 ${lato.className}`}>➔</h1>
                </div>
                <p
                    className="text-xl"
                >
                    {description}
                </p>
                
            </div>
        </Link>
    )
}