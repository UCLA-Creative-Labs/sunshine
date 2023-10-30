import ContentSection from "@/components/ContentSection";
import { Lato } from "next/font/google"

const lato = Lato({ weight: '700', subsets: ['latin'] });

function RoleCard({ imgSrc, title, desc, className }: { imgSrc: string, title: string, desc?:string, className?: string }) {
    return (
        <div className={`flex flex-col items-center w-full space-y-5 group ${className}`}>
            <img src={imgSrc} className="h-1/2 py-4 drop-shadow-lg group-hover:scale-125 transition ease-in-out delay-50 duration-300" />
            <h1 className={`text-center text-2xl ${lato.className}`}>{title}</h1>
            <p className="leading-relaxed text-center">
                {desc}
            </p>
        </div>
    )
}

export default function JoinContent() {
    return (
        <div className="text-black min-w-full">
            <ContentSection title="OPPORTUNITIES">
                <div className="flex flex-col space-y-5 [&>*]:text-xl [&>*]:leading-relaxed">
                    <p className="text-2xl">At Creative Labs, we have activities that all students can participate in!</p>
                    <p className="text-xl font-bold pl-10">(1) Workshops:</p>
                    <p className="text-xl pl-20">
                        Anyone can attend workshops! We teach a variety of topics from basic design skills to illustrating. Follow our Instagram and Discord for the most recent updates!
                    </p>
                    <p className="text-xl font-bold pl-10">(2) Events:</p>
                    <p className="text-xl pl-20">
                        Anyone can also attend events! We sometimes invite famous people to talk about their passions or have companies talk about recruitment opportunities. Follow our Instagram and Discord for the most recent updates!
                    </p>
                    <p className="text-xl font-bold pl-10">(3) Projects:</p>
                    <p className="text-xl pl-20">
                        Students must apply to projects before the start of each quarter. Students can either be a Project Lead or Project Member. Together, everyone will work to complete a project by the end of the quarter. To see projects from past quarters, visit our Projects page.
                    </p>
                </div>
            </ContentSection>

            <ContentSection title="HOW DO WE OPERATE?">
                <div className="flex flex-col space-y-6 [&>*]:text-xl [&>*]:leading-relaxed">
                    <p>
                        Everyone is already part of the Creative Labs community! We also have various roles that students can apply to every quarter. Creative Labs has three main roles: Project Leads, Project Members, and Internal Board Members.
                    </p>
                    <p>
                        Our first main component is the internal board. The internal board is responsible for running things behind the scenes like organizing events, socials, and workshops. Responsibilities and tasks vary depending on which team within the internal board you apply to. These teams include Design, Tech, Marketing/External, and Projects. In simpler terms, the Creative Labs community is managed by a small group of UCLA designers, developers, marketers, and project managers hoping to create cool and creative things together!
                    </p>
                    <p>
                        External projects consist of Project Leads and Project Members who work together to complete a project by the end of the quarter. Project Leads apply with a creative idea, and Project Members help that vision come true with their various skills.
                    </p>
                </div>
            </ContentSection>

            <ContentSection title="MAIN ROLES" titleClassName="text-4xl">
                <div className="flex items-start w-full space-x-12">
                    <RoleCard
                        imgSrc="/card_icons/pink_thing.svg" 
                        title="Project Lead"
                        desc="Have a cool idea? Apply to be a Project Lead and make it happen. We'll provide you the platform needed to recruit your dream team. Projects can be technical or non-technical! Past projects have ranged from a smart mirror to a fancy photoshoot."
                    />
                    <RoleCard 
                        imgSrc="/card_icons/purple_thing.svg" 
                        title="Project Member"
                        desc="Want to be a part of something wonderful? Apply as a Project Member and collaborate with a Project Lead and other Project Members to create something awesome! Experience necessary varies! "
                    />
                    <RoleCard
                        imgSrc="/card_icons/orange_thing.svg"
                        title="Board Member"
                        desc="We're always looking to grow our internal team! Help us run things behind the scenes like organizing events, socials, and workshops, communicating with Project Teams, securing funding, and creating promotional materials! "
                    />
                </div>
            </ContentSection>

            <ContentSection title="INTERNAL BOARD TEAMS" titleClassName="text-4xl">
                
            </ContentSection>
        </div>
    )
}