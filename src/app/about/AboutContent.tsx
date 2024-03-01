import ContentSection from "@/components/ContentSection";

export default function AboutContent() {
    return (
        <div className="grow flex flex-col space-y-10 px-20 py-20 text-black min-w-full">
            <ContentSection title="ABOUT">
                <p className="text-lg">
                    We connect students from all disciplines and backgrounds together to bring any creative passion project to life! We offer various opportunities to students such as workshops and socials, which are available to everyone, and projects, which require an application process. A team of students will then work together to complete a project by the end of the quarter. Creative Labs started as a small group of friends and is founded on the idea that with the right group of people, any idea can come to life. Let's make something cool together!
                </p>
            </ContentSection>
            <ContentSection title="BOARD MEMBER HIGHLIGHTS">
                Work in progress :D
            </ContentSection>
            <ContentSection title="UPCOMING EVENTS">
                Work in progress :D
            </ContentSection>
            <ContentSection title="PAST EVENTS">
                Work in progress :D
            </ContentSection>
        </div>
    )
}