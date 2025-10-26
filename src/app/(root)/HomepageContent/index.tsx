import ContentSection from "@/components/ContentSection"
import GenericCard from "@/components/GenericCard"
import ProjectCard from "@/components/ProjectCard"
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
                <ProjectCard
                    imgSrc="/projects/25-26/25-26_year_banner.svg"
                    title="2025-2026"
                    className="md:w-1/3"
                    href="/projects/25-26"
                />
                <ProjectCard
                    imgSrc="/projects/24-25/24-25_year_banner.svg"
                    title="2024-2025"
                    className="md:w-1/3"
                    href="/projects/24-25"
                />
                <ProjectCard
                    imgSrc="/projects/23-24/23-24_year_banner.svg"
                    title="2023-2024"
                    className="md:w-1/3"
                    href="/projects/23-24"
                />
            </ContentSection>
        </div>
    )
}