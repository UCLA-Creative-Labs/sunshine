import ContentSection from "@/components/ContentSection"
import GenericCard from "@/components/GenericCard"
import ProjectCard from "@/components/ProjectCard"
import projectData from "@/assets/projectData"
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
                        Every quarter, we have student teams collaborate and execute any creative idea. Browse some of the cool projects we've made in past quarters down below, or take a look at the entire projects archive{" "}
                        <Link href="/projects" className="border-b border-black">
                            HERE
                        </Link>
                        . Have fun!
                    </>
                }
            >
                {projectData.slice(0, 3).map((project) => (
                    <ProjectCard
                        key={project.year}
                        imgSrc={project.img}
                        title={project.title}
                        className="md:w-1/3"
                        href={`/${project.url}`}
                    />
                ))}
            </ContentSection>
        </div>
    )
}