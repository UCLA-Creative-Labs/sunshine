import GenericCard from "@/components/GenericCard"
import HomepageSection from "./HomepageSection"

export default function HomepageContent() {
    return (
        <div className="text-black min-w-full divide-y-2 divide-black">
            <HomepageSection
                title="ABOUT"
            >
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
            </HomepageSection>
            <HomepageSection
                title="PROJECTS"
            >
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
            </HomepageSection>
        </div>
    )
}