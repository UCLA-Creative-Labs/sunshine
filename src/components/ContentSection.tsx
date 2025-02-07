import { Lato } from "next/font/google"

const lato = Lato({ weight: '700', subsets: ['latin'] });

interface ContentSectionProps {
    title?: string,
    description?: React.ReactNode,
    children?: React.ReactNode,
    centerText?: boolean,
    titleClassName?: string
}

export default function ContentSection({ title, description, children, centerText=false, titleClassName="text-2xl md:text-4xl" } : ContentSectionProps) {
    return (
    <div className="space-y-8">
        <h1 className={ `text-center ${!centerText && "md:text-start"} ${titleClassName} tracking-wide ${lato.className}` }>
            {title}
            <span className="ml-2 text-3xl group-hover:translate-x-2 transition-transform ease-in-out duration-300">➔</span>
        </h1>
        {description && <p className="text-center md:text-start text-lg">{description}</p>}  
        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-16">
            { children }
        </div>
    </div>
    )
}