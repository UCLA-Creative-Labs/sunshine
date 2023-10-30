import ContentSection from "@/components/ContentSection";

/*
Display a responsive hero image that disappears on mobile
*/
function ShowcaseImage({ src, className } : { src: string, className?: string }) {
    return (
        <img 
            src={src}
            className={`object-contain xl:max-h-full shadow-2xl rounded-2xl ${className}`}
        />
    )
}

/*
Responsively display a square photo + blurb
- Board member/alumni highlights
*/
function HighlightCard({ imgSrc, blurb, reverse=false, className }: { imgSrc: string, blurb: string, reverse?: Boolean, className?: string}) {
    return (
        <div className={ `flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10 ${reverse && 'lg:flex-row-reverse lg:space-x-reverse' } items-center ${className}`}>
            <div className="aspect-square w-[200px] lg:w-max xl:h-[200px]">
                <img src={imgSrc} className="object-cover h-full rounded-xl"/>
            </div>
            <p className="text-xl lg:text-2xl">
                {blurb}
            </p>
        </div>
    )
}

function EventCard({ imgSrc, title, date=undefined, location=undefined, desc, orientation="h", className }: 
    { imgSrc: string, title: string, date?: string|undefined, location?: string|undefined, desc: string, orientation?: string, className?: string }) {

    let orientationBool = orientation == "h";

    return (
        <div className={ `flex ${ orientationBool ? "flex-row space-x-8 w-full" : "flex-col space-y-5" } items-center p-5 rounded-2xl transition ease-in-out delay-50 duration-300 hover:scale-110 hover:shadow-2xl hover:border hover:border-black ${className}`}>
            <div className="aspect-square h-[150px] md:h-[200px]">
                <img src={imgSrc} className="object-cover h-full rounded-2xl drop-shadow-lg"/>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex flex-col text-center">
                    <h1 className={`text-2xl ${orientationBool ? "md:text-4xl" : "md:text-2xl"} tracking-wide`}>{title}</h1>
                    { date && <h2 className="text-xl md:text-2xl underline">{date}</h2> }
                    { location && <h2 className="text-xl md:text-2xl underline" >{location}</h2> }
                </div>
                <p>{desc}</p>
            </div>
        </div>
    )
}

export default function AboutContent() {
    return (
        <div className="text-black min-w-full md:py-20">
            <div className="hidden md:flex justify-center px-20">
                <ShowcaseImage src="/old/about.jpg" className="xl:w-4/5" />
            </div>

            <ContentSection title="ABOUT US">
                <p className="text-2xl leading-loose">
                    We connect students from all disciplines and backgrounds together to bring any creative passion project to life! We offer various opportunities to students such as workshops and socials, which are available to everyone, and projects, which require an application process. A team of students will then work together to complete a project by the end of the quarter. Creative Labs started as a small group of friends and is founded on the idea that with the right group of people, any idea can come to life. Let’s make something cool together!
                </p>
            </ContentSection>

            <ContentSection title="BOARD MEMBER HIGHLIGHTS">
                <div className="flex flex-col items-center space-y-20 py-10">
                    <HighlightCard 
                        imgSrc="https://www.mediastorehouse.com/p/172/bornean-orang-utan-adult-male-zoo-645392.jpg.webp"
                        blurb="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. -some monke"
                        className="xl:w-4/5"
                    />
                    <HighlightCard 
                        imgSrc="https://www.mediastorehouse.com/p/172/bornean-orang-utan-adult-male-zoo-645392.jpg.webp"
                        blurb="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. -some monke"
                        reverse={true}
                        className="xl:w-4/5"
                    />
                </div>
            </ContentSection>

            <ContentSection title="ALUMNI RECOLLECTIONS">
                <div className="flex flex-col items-center space-y-20 py-10">
                    <HighlightCard 
                        imgSrc="https://www.mediastorehouse.com/p/172/bornean-orang-utan-adult-male-zoo-645392.jpg.webp"
                        blurb="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. -some monke"
                        className="xl:w-4/5"
                    />
                    <HighlightCard 
                        imgSrc="https://www.mediastorehouse.com/p/172/bornean-orang-utan-adult-male-zoo-645392.jpg.webp"
                        blurb="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. -some monke"
                        reverse={true}
                        className="xl:w-4/5"
                    />
                </div>
            </ContentSection>

            <ContentSection title="UPCOMING EVENTS" centerText={true}>
                <div className="flex flex-col items-center space-y-20 py-10 w-full">
                    <EventCard 
                        imgSrc="/old/f22_demo.png"
                        title="Fall 2022 Demo Day"
                        date="Thursday, December 1 @ 6pm"
                        location="Haines A18"
                        desc="🍊DEMO DAY IS COMING🍊 come check out fall quarter's demo day THIS THURSDAY!! @ 6PM in Haines A18!! hear about all the cool😎and creative😋projects and get inspired💡be there 🫵 or be square❎."
                        className="xl:w-2/3"
                    />
                    <EventCard 
                        imgSrc="/old/f22_social.png"
                        title="Bracelet Social"
                        date="Friday, October 21 @ 3pm"
                        location="Tongva Steps"
                        desc="Come make a bracelet, keychain, or phone charm at 🆑's bracelet-making 🧵 social this Friday (10/21)! We'll be at the Tongva Steps from 3PM - 5PM 🪷 See you there! 🐸 Due to limited supplies, RSVP at tinycl.com/bracelet-social to guarantee your spot 🫶."
                        className="xl:w-2/3"
                    />
                    <EventCard 
                        imgSrc="/old/f22_workshop.png"
                        title="Spotify API Workshop"
                        date="Tuesday, October 18 @ 6pm"
                        location="Dodd 170"
                        desc="To start 🏃‍♀️off our year we wanted to welcome everyone to our first workshop👾! Led by the Tech 🤖 team, learn how to access your top fifty songs 🎶using the Spotify API Tuesday (10/18) at 6pm at Dodd 170🏫! RSVP at tinycl.com/spotify-workshop 🐸."
                        className="xl:w-2/3"
                    />
                </div>
            </ContentSection>

            <ContentSection title="PAST EVENTS" centerText={true}>
                <div className="flex flex-col items-start lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10 py-10">
                    <EventCard 
                        imgSrc="/old/s22_demo.png"
                        title="Spring 2022 Demo Day"
                        desc="Hello!! Demo Day is coming up this Friday, June 3rd from 6-8 PM @ Kinsey 1200B. Our project leads and members are super excited for you to see their projects this quarter !! Be there if you're cool 🐸."
                        orientation="v"
                        className="w-1/2 lg:w-1/3"
                    />
                    <EventCard 
                        imgSrc="/old/s22_social.png"
                        title="Sharetea Social"
                        desc="Need a pick-me-up?? Get 🧋 boba 🧋 with us today!See you at De Neve turnaround at 7 or meet us at Sharetea at 7:20pm!!"
                        orientation="v"
                        className="w-1/2 lg:w-1/3"
                    />
                    <EventCard 
                        imgSrc="/old/s22_gm.png"
                        title="Spring 2022 General Meeting"
                        desc="Want to take part in some awesome 🌟 projects? Meet cool 😎 people? Gain technical 👾 and non-technical 📝 experience? Come to CL's 🌸 Spring General Meeting 🌸!"
                        orientation="v"
                        className="w-1/2 lg:w-1/3"
                    />
                </div>
            </ContentSection>
        </div>
    )
}