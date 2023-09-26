import { Lato } from "next/font/google"
import Card from "./Card"

const lato = Lato({ weight: '700', subsets: ['latin'] })

export default function About() {
    return (
        <div className="text-black min-w-full p-10 lg:p-20 space-y-12">
            <h1 className={ `text-5xl text-center tracking-wide ${lato.className}` }>
                ABOUT US
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-12">
                <Card title="OUR TEAM" text="test data"/>
                <Card title="Team" text="test data"/>
            </div>
        </div>
    )
}