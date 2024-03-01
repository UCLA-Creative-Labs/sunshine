import { Lato } from "next/font/google"

const lato = Lato({ weight: '700', subsets: ['latin'] });

interface ContentSectionProps {
    title?: string,
    children?: React.ReactNode,
    centerText?: boolean,
    titleClassName?: string
}

export default function ContentSection({ title, children, centerText=false, titleClassName="text-4xl" } : ContentSectionProps) {
    return (
    <div className="space-y-10">
        <h1 className={ `text-center ${!centerText && "md:text-start"} ${titleClassName} tracking-wide ${lato.className}` }>
            {title}
        </h1>
        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-16">
            { children }
        </div>
    </div>
    )
}