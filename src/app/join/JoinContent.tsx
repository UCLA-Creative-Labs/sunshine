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

function TeamCard({ className='', title, imgSrc, bgClassName='', description='', reverse=false }: { className?: string, title: string, imgSrc: string, bgClassName?: string, description?: string, reverse?: boolean }) {
    return (
        <div className={`group space-y-4 ${className}`}>
            <div className={`flex justify-center items-center space-x-4 rounded-xl drop-shadow-lg group-hover:scale-110 transition ease-in-out delay-50 duration-300 ${bgClassName} ${reverse ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <img src={imgSrc} className="h-1/2 py-4 drop-shadow-xl" />
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            <p className="mx-4 tracking-wide leading-relaxed">
                {description}
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

            <ContentSection title="MAIN ROLES" centerText={true} titleClassName="text-4xl">
                <div className="flex items-start w-full space-x-12">
                    <RoleCard
                        imgSrc="/card_icons/pink_thing_scaled.svg" 
                        title="Project Lead"
                        desc="Have a cool idea? Apply to be a Project Lead and make it happen. We'll provide you the platform needed to recruit your dream team. Projects can be technical or non-technical! Past projects have ranged from a smart mirror to a fancy photoshoot."
                    />
                    <RoleCard 
                        imgSrc="/card_icons/purple_thing_scaled.svg" 
                        title="Project Member"
                        desc="Want to be a part of something wonderful? Apply as a Project Member and collaborate with a Project Lead and other Project Members to create something awesome! Experience necessary varies! "
                    />
                    <RoleCard
                        imgSrc="/card_icons/orange_thing_scaled.svg"
                        title="Board Member"
                        desc="We're always looking to grow our internal team! Help us run things behind the scenes like organizing events, socials, and workshops, communicating with Project Teams, securing funding, and creating promotional materials! "
                    />
                </div>
            </ContentSection>

            <ContentSection title="INTERNAL BOARD TEAMS" centerText={true} titleClassName="text-4xl">
                <div className="flex justify-center">
                    <div className="w-4/5 content-center grid grid-cols-2 gap-12">
                        <TeamCard 
                            bgClassName="bg-red-100 group-hover:bg-red-200" 
                            title="Design" 
                            imgSrc="/card_icons/orange_thing.svg"
                            description="Help us strengthen our visual identity by creating cool design-y things! You can also learn and improve your skills in graphic design, web design, and UI/UX! Previous design work includes creating social media graphics, presentation slides, and wireframes for website redesigns and brainstorming new yearly themes and logos. We hosted events such as Figma workshops and design jams like Capslock!"
                        />
                        <TeamCard 
                            bgClassName="bg-green-100 group-hover:bg-green-200" 
                            title="Tech" 
                            imgSrc="/card_icons/orange_thing.svg"
                            description="Support our club infrastructure and work on long-term community projects! We are currently working on a membership platform, board management tools, a market platform, and MLOps projects. If you're interested in these, feel free to reach out!"
                        />
                        <TeamCard 
                            bgClassName="bg-blue-100 group-hover:bg-blue-200" 
                            title="Marketing/External" 
                            imgSrc="/card_icons/orange_thing.svg"
                            reverse={true}
                            description="We help editing materials before they go out for public consumption! Some main tasks include copywriting,  creating a posting schedule, and reaching out to other clubs/businesses. Previous marketing/external work includes writing blurbs for social media, advertising events, and promoting our club!"
                        />
                        <TeamCard 
                            bgClassName="bg-yellow-100 group-hover:bg-yellow-200" 
                            title="Projects" 
                            imgSrc="/card_icons/orange_thing.svg" 
                            reverse={true}
                            description="Our main responsibility is hosting Creative Labs projects! Tasks include reaching out to projects teams, preparing for General Meetings and Demo Days, and compiling project info for documentation. In other words, you’ll be making sure that projects runs smoothly and stays on track by being the bridge between Project Leads and Project Members and the rest of the Internal Board!"
                        />
                    </div>
                </div>
            </ContentSection>
        </div>
    )
}