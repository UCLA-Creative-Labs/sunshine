import ContentSection from "@/components/ContentSection"
import GenericCard from "@/components/GenericCard"
import Link from "next/link";


export default function HomepageContent() {
    return (
        <div className="text-black min-w-full p-20 space-y-10">
            <ContentSection
                title="ABOUT"
            >
                <GenericCard
                    imgSrc="/card_icons/what-we-do.svg"
                    title="Creativity for All!"
                    description="We bring students from all disciplines and backgrounds together to work on technical and creative projects. Let’s make something cool!"
                    className="md:w-1/2"
                    end="LEARN MORE ABOUT CL"
                    href="/about"
                />
                <GenericCard
                    imgSrc="/card_icons/who-are-we.svg"
                    title="How do we operate?"
                    description="We have two main components: internal board who runs things behind the scenes and external projects that change every quarter."
                    className="md:w-1/2"
                    end="INTERESTED? JOIN US"
                    href="/join"
                />
            </ContentSection>
            <ContentSection
                title="PROJECTS"
                description={
                    <>
                        Every quarter, we have student teams collaborate and execute any creative idea. Browse some of the cool projects we’ve made in past quarters down below, or take a look at the entire projects archive{" "}
                        <Link href="/projects">
                            <a className="border-b border-black">HERE</a>
                        </Link>
                        . Have fun!
                    </>
                }
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