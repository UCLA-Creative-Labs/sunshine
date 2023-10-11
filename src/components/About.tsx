import { Lato } from "next/font/google"
import Card from "./Card"
import CardRow from "./CardRow"

const lato = Lato({ weight: '900', subsets: ['latin'] })

export default function About() {
    return (
        <div className="text-black min-w-full p-10 lg:px-60 lg:py-20 space-y-20">
            <h1 className={ `text-5xl tracking-wide ${lato.className}` }>
                ABOUT
            </h1>
        </div>
    )
}