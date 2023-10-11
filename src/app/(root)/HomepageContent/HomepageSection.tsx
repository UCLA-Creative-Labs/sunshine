import { Lato } from "next/font/google"

const lato = Lato({ weight: '700', subsets: ['latin'] });

interface HomepageSectionProps {
    title?: string,
    children?: React.ReactNode
}

export default function HomepageSection({ title, children } : HomepageSectionProps) {
    return (
    <div className="p-10 sm:p-20 xl:px-60 lg:py-20 space-y-10">
        <h1 className={ `text-center md:text-start text-5xl tracking-wide ${lato.className}` }>
            {title}
        </h1>
        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-16">
            { children }
        </div>
    </div>
    )
}