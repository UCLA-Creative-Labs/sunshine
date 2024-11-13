import ContentSection from "@/components/ContentSection"
import GenericCard from "@/components/GenericCard"

export default function HomepageContent() {
    return (
        <div className="text-black min-w-full p-20 space-y-10">
            <ContentSection
                title="ABOUT"
            >
                <GenericCard
                    imgSrc="/card_icons/what-we-do.svg"
                    title="Who are we? What is Creative Labs?"
                    description="We connect students from all disciplines and backgrounds together to bring any creative passion project to life! Creative Labs started as a small group of friends and is founded on the idea that with the right group of people, any idea can come to life. Let’s make something cool together!"
                    className="md:w-1/2"
                    end="ABOUT CREATIVE LABS"
                />
                <GenericCard
                    imgSrc="/card_icons/who-are-we.svg"
                    title="How do we operate?"
                    description="We have two main components: internal board and external projects. The internal board is responsible for running things behind the scenes like hosting events, socials, and workshops (which are open to everyone)! External projects work together in teams to complete and execute any creative idea by the end of the quarter."
                    className="md:w-1/2"
                    end="JOIN US"
                />
            </ContentSection>
            <ContentSection
                title="PROJECTS"
                description="Every quarter we have student teams collaborate and execute an idea. Below are some projects that were created in the past quarters."
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
            </ContentSection>
        </div>
    )
}