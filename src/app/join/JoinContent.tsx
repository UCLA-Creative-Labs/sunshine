import ContentSection from "@/components/ContentSection";
import GenericCard from "@/components/GenericCard";

function RoleCard({ src, imgSrc, title, desc, appTime, className }: { src: string, imgSrc: string, title: string, desc?:string, appTime?: string, className?: string }) {
	return (
		<div className={`border-2 border-black-300 rounded-lg p-6 flex flex-col h-full transition-transform duration-300 hover:scale-105 ${className}`}>
			<div className="flex flex-col items-center w-full space-y-4 group flex-grow">
				<img src={imgSrc} className="h-24 w-24 py-4 drop-shadow-lg group-hover:scale-110 transition ease-in-out duration-300" />
				<h1 className="text-center text-2xl font-bold font-[family-name:var(--font-lato)]">{title}</h1>
				{appTime && <p className="text-sm font-semibold text-gray-500">{appTime}</p>}
				<p className="leading-relaxed text-center">{desc}</p>
			</div>
			{/* Link at the bottom left */}
			<a href={src} target="_blank" className="mt-auto text-black-500 font-semibold hover:underline text-left">
				{title.toUpperCase()} APPS ➜
			</a>
		</div>
	);
}


function TeamCard({ className='', title, imgSrc, appTime, bgClassName='', description='', reverse=false }: { className?: string, title: string, imgSrc: string, appTime?: string, bgClassName?: string, description?: string, reverse?: boolean }) {
	return (
	  <div className={`group p-4 border-2 border-black-300 rounded-lg p-6 transition-transform duration-300 hover:scale-105 ${className}`}>
		<div className={`flex justify-center items-center space-x-4 rounded-xl drop-shadow-lg ${bgClassName} ${reverse ? 'flex-row-reverse space-x-reverse' : ''}`}>
		  <img src={imgSrc} className="h-[100px] md:h-[100px] py-4 drop-shadow-xl" />
		  <div className="flex flex-col items-center">
			<h1 className="text-2xl font-bold">{title}</h1>
			{appTime && <p className="text-sm font-semibold text-gray-500">{appTime}</p>}
		  </div>
		</div>
		<p className="mx-4 mt-2 tracking-wide leading-relaxed">{description}</p>
	  </div>
	);
  }

// function OpportunityCard({ imgSrc, title, description }: { imgSrc: string, title: string, description: string }) {
// 	return (
// 		<div className="border-2 border-black-300 rounded-lg p-6 transition-transform duration-300 hover:scale-105">
// 		<div className="flex flex-col items-center w-full space-y-4">
// 			<img src={imgSrc} className="h-24 w-24 py-4 drop-shadow-lg" />
// 			<h1 className="text-2xl text-center font-bold">{title}</h1>
// 			<p className="leading-relaxed text-center">{description}</p>
// 		</div>
// 		</div>
// 	);
// }

export default function JoinContent({ pLeadLink='#', pMemLink='#', bMemLink='#' } : { pLeadLink?: string, pMemLink?: string, bMemLink: string }) {
	return (
		<div className="text-black min-w-full p-10 md:p-20 space-y-20">
			<ContentSection title="OPPORTUNITIES">
				<div className="flex flex-col space-y-8">
					<p className="text-xl mb-2">
							At Creative Labs, we always have activities that all students can participate in! Stay tuned on our Instagram for the most recent updates!
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<GenericCard
						title="Socials and Workshops"
						description="Let's chill together by scrapbooking, painting, or making bracelets... Or you can learn something new like our past Figma, Spotify API, or zine-designing workshops!"
						imgSrc="/old/socials_workshops.png"
						imgPos="top"
						className="h-full"
					/>
					<GenericCard
						title="Quarterly Projects"
						description="Apply as a Project Lead or Project Member and gain hands-on experience by making something cool by the end of the quarter! To see projects from past quarters, visit our Projects page."
						imgSrc="/old/quarterly_projects.png"
						imgPos="top"
						className="h-full"
					/>
					<GenericCard
						title="Internal Work"
						description="Apply and strengthen your skills by managing the club behind the scenes! Designing our iconic branding, upkeeping our club's website, planning club events, and overseeing external projects are just a few examples!"
						imgSrc="/old/internal_work.png"
						imgPos="top"
						className="h-full"
					/>
					</div>
				</div>
			</ContentSection>
			<ContentSection title="HOW DO WE OPERATE?">
				<div className="flex flex-col space-y-6 md:[&>*]:text-xl [&>*]:leading-relaxed">
					<p>Everyone is already part of the Creative Labs community! We also have various roles that students can apply to every quarter. Creative Labs has two main components: Internal Board which consist of four teams and External Projects which consist of Project Leads and Project Members.</p>
				</div>
			</ContentSection>

			<ContentSection title="INTERNAL BOARD TEAMS">
				<div className="flex flex-col space-y-8">
					<div className="flex flex-col space-y-6 md:[&>*]:text-xl [&>*]:leading-relaxed">
						<p>Our first main component is the internal board. The internal board is responsible for running things behind the scenes like organizing events, socials, and workshops. Responsibilities and tasks vary depending on which team within the internal board you apply to. These teams include Design, Tech, Marketing/External, and Projects. In simpler terms, the Creative Labs community is managed by a small group of UCLA designers, developers, marketers, and project managers hoping to create cool and creative things together! We accept applications 24/7 throughout the year.</p>
					</div>
					<div className="flex justify-center">
						<div className="content-center grid md:grid-cols-2 gap-12">
							<TeamCard 
								bgClassName="bg-red-100 group-hover:bg-red-200" 
								title="Design" 
								imgSrc="/card_icons/orange_thing.svg"
								description="Help us strengthen our visual identity by creating cool design-y things! You can also learn and improve your skills in graphic design, web design, and UI/UX!"
							/>
							<TeamCard 
								bgClassName="bg-blue-100 group-hover:bg-blue-200" 
								title="Tech" 
								imgSrc="/card_icons/orange_thing.svg"
								description="Support our club infrastructure and work on long-term community projects! We are currently working on a membership platform, board management tools, a market platform, and MLOps projects."
							/>
							<TeamCard 
								bgClassName="bg-green-100 group-hover:bg-green-200" 
								title="Marketing/External" 
								imgSrc="/card_icons/orange_thing.svg"
								reverse={true}
								description="We help edit materials before they go out for public consumption! Main tasks include copywriting, creating a posting schedule, and reaching out to other clubs/businesses."
							/>
							<TeamCard 
								bgClassName="bg-purple-100 group-hover:bg-purple-200" 
								title="Projects" 
								imgSrc="/card_icons/orange_thing.svg" 
								reverse={true}
								description="Our main responsibility is hosting Creative Labs projects! Tasks include reaching out to project teams, preparing for General Meetings and Demo Days, and ensuring smooth project operations."
							/>
							<TeamCard 
								bgClassName="bg-yellow-100 group-hover:bg-yellow-200" 
								title="Finance" 
								imgSrc="/card_icons/orange_thing.svg" 
								reverse={true}
								description="Securing funding and creating a club budget helps us continue to run CL projects and host even cooler events. Join us and help keep CL going!"
							/>
						</div>
					</div>
				</div>
			</ContentSection>
			<ContentSection title="EXTERNAL QUARTERLY PROJECTS">
				<div className="flex flex-col space-y-8">
					<div className="flex flex-col md:[&>*]:text-xl [&>*]:leading-relaxed">
						<p>The second component is external projects, which consist of Project Leads and Project Members who work together to complete a project by the end of the quarter. Project Leads apply with a creative idea, and Project Members help that vision come true with their various skills. We accept applications only before the start of each quarter.</p>
					</div>
					<div className="flex justify-center">
						<div className="content-center grid md:grid-cols-2 gap-12">
							<RoleCard
								imgSrc="/card_icons/pink_thing_scaled.svg" 
								title="Project Lead"
								desc="Have a cool idea? Apply to be a Project Lead and make it happen. We'll provide you the platform needed to recruit your dream team. Projects can be technical or non-technical!"
								src={pLeadLink}
							/>
							<RoleCard 
								imgSrc="/card_icons/purple_thing_scaled.svg" 
								title="Project Member"
								desc="Want to be a part of something wonderful? Apply as a Project Member and collaborate with a Project Lead and other Project Members to create something awesome!"
								src={pMemLink}
								
							/>
						</div>
					</div>
				</div>
			</ContentSection>
		</div>
	)
}



{/* <a href="project-lead-application-link" className="mt-4 text-blue-500 font-semibold hover:underline">
  PROJECT LEAD APPS ➜
</a> */}
