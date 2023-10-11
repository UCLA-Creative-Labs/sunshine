import GenericCard from "@/components/GenericCard"
import { Lato } from "next/font/google"

const lato = Lato({ weight: '700', subsets: ['latin'] })

export default function About() {
    return (
        <div className="text-black min-w-full divide-y-2 divide-black">
            <div className="p-10 sm:p-20 xl:px-60 lg:py-20 space-y-10">
                <h1 className={ `text-center md:text-start text-5xl tracking-wide ${lato.className}` }>
                    ABOUT
                </h1>
                <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-16">
                    <GenericCard
                        imgSrc="/card_icons/what-we-do.svg"
                        title="Creativity for All"
                        description="We bring students from all disciplines and backgrounds together to work on technical & creative projects."
                        className="md:w-1/2"
                    />
                    <GenericCard
                        imgSrc="/card_icons/who-are-we.svg"
                        title="Welcome to Our Lab"
                        description="Just some UCLA kids with skills in dev, design, and project management trying to make something cool, together. We were founded on the dream that with the right group of people, any idea can come to life."
                        className="md:w-1/2"
                    />
                </div>
            </div>
            <div className="p-10 sm:p-20 xl:px-60 lg:py-20 space-y-10">
                <h1 className={ `text-center md:text-start text-5xl tracking-wide ${lato.className}` }>
                    PROJECTS
                </h1>
                <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-4 lg:space-x-16">
                    <GenericCard
                        imgSrc="/card_icons/fall.svg"
                        title="Fall 2023"
                        description="Start the year strong with these new projects!"
                        className="md:w-1/3"
                    />
                    <GenericCard
                        imgSrc="/card_icons/spring.svg"
                        title="Spring 2023"
                        description="End the academic year with a quick browse through our projects."
                        className="md:w-1/3"
                    />
                    <GenericCard
                        imgSrc="/card_icons/winter.svg"
                        title="Winter 2023"
                        description="Kick off the holiday season with our brand new projects."
                        className="md:w-1/3"
                    />
                </div>
            </div>
        </div>
    )
}